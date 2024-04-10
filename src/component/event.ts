import { JournalTry } from "../journal/try";

interface HandlerInfo{
    callback: (event?: Event) => void;
    excepts: Array<HTMLElement> | null;
}

interface ListenersInfo{
    handlers: Array<HandlerInfo>;
    excepts: Array<HTMLElement> | null;
}

interface TargetScope{
    target: HTMLElement;
    listeners: Record<string, ListenersInfo>;
}

interface OutsideEventDetails{
    targetScopes: Array<TargetScope>;
    eventCallbacks: Record<string, (event: Event) => void>;
}

const InlineJS_OutsideEvent_Key = 'InlineJS_OutsideEvent';

function GetOutsideEventGlobalBlock(): OutsideEventDetails{
    return (globalThis[InlineJS_OutsideEvent_Key] = (globalThis[InlineJS_OutsideEvent_Key] || {
        targetScopes: new Array<TargetScope>(),
        eventCallbacks: {},
    }));
}

export function AddOutsideEventListener(target: HTMLElement, events: string | Array<string>, handler: (event?: Event) => void){
    let block = GetOutsideEventGlobalBlock(), targetScope = block.targetScopes.find(scope => (scope.target === target));
    if (!targetScope){//Add new entry
        targetScope = {
            target: target,
            listeners: {},
        };
        block.targetScopes.push(targetScope);
    }

    (Array.isArray(events) ? events : [events]).forEach((event) => {
        if (!(event in targetScope!.listeners)){//Add new entry
            targetScope!.listeners[event] = {
                handlers: new Array<HandlerInfo>(),
                excepts: null,
            };
        }

        targetScope!.listeners[event].handlers.push({
            callback: handler,
            excepts: null,
        });

        if (!(event in block.eventCallbacks)){//Bind
            block.eventCallbacks[event] = (e: Event) => {
                block.targetScopes.forEach((scope) => {//Traverse scopes
                    if (!(e.type in scope.listeners) || scope.target === e.target || scope.target.contains(e.target as Node)){
                        return;//Not listening to raised event OR event occured inside target
                    }

                    if ((scope.listeners[e.type].excepts || []).findIndex(except => (except === e.target || except.contains(e.target as Node))) != -1){
                        return;//Event target was registered as an exception
                    }

                    scope.listeners[e.type].handlers
                    .filter(info => ((info.excepts || []).findIndex(except => (except === e.target || except.contains(e.target as Node))) == -1))
                    .forEach(info => JournalTry(() => info.callback(e), 'InlineJS.OutsideEventListener'));
                });
            };

            window.addEventListener(event, block.eventCallbacks[event]);
        }
    });
}

export function RemoveOutsideEventListener(target: HTMLElement, events: string | Array<string>, handler: (event?: Event) => void){
    const targetScope = GetOutsideEventGlobalBlock().targetScopes.find(scope => (scope.target === target));
    if (!targetScope){
        return;
    }

    (Array.isArray(events) ? events : [events]).forEach((event) => {
        if (event in targetScope!.listeners){
            if (handler){
                targetScope!.listeners[event].handlers = targetScope!.listeners[event].handlers.filter(info => (info.callback !== handler));
            }
            else{//Remove all
                delete targetScope!.listeners[event];
            }
        }
    });
}

export function AddOutsideEventExcept(target: HTMLElement, list: Record<string, Array<HTMLElement> | HTMLElement>, handler?: (event?: Event) => void){
    const targetScope = GetOutsideEventGlobalBlock().targetScopes.find(scope => (scope.target === target));
    if (!targetScope){
        return;
    }

    Object.keys(list).forEach((event) => {
        if (!(event in targetScope!.listeners)){
            return;
        }

        if (handler){
            const info = targetScope!.listeners[event].handlers.find(item => (item.callback === handler));
            if (info){
                info.excepts = (info.excepts || new Array<HTMLElement>());
                (Array.isArray(list[event]) ? (list[event] as Array<HTMLElement>) : [(list[event] as HTMLElement)]).forEach((item) => {
                    info!.excepts!.push(item);
                });
            }
        }
        else{//General
            targetScope!.listeners[event].excepts = (targetScope!.listeners[event].excepts || new Array<HTMLElement>());
            (Array.isArray(list[event]) ? (list[event] as Array<HTMLElement>) : [(list[event] as HTMLElement)]).forEach((item) => {
                targetScope!.listeners[event].excepts!.push(item);
            });
        }
    });
}

export function UnbindOutsideEvent(target: HTMLElement){
    GetOutsideEventGlobalBlock().targetScopes = GetOutsideEventGlobalBlock().targetScopes.filter(scope => (scope.target !== target && !target.contains(scope.target)));
}
