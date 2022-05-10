import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { GetGlobal } from "../../global/get";
import { AddChanges } from "../../proxy/add-changes";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { IComponent } from "../../types/component";

const StateDirectiveName = 'state';

type StateErrorCallbackType = () => Array<string> | string;

function BindState(componentId: string, component: IComponent | null, contextElement: HTMLElement){
    let elementScope = component?.FindElementScope(contextElement), localKey = `\$${StateDirectiveName}`, parentKey = `#${StateDirectiveName}`;
    if (elementScope?.HasLocal(localKey)){
        return;
    }

    let resetCallbacks = new Array<() => void>();
    let id = (component?.GenerateUniqueId('state_proxy_') || ''), errorCallbacks = new Array<StateErrorCallbackType>(), state = {
        invalid: 0,
        dirty: 0,
        changed: 0,
    };

    let message: string | null = null, parent = component?.FindElementLocalValue(contextElement, parentKey, true), alertUpdate = (key: string, trend: 1 | -1) => {
        if ((trend == -1 && state[key] == 0) || (trend == 1 && state[key] == 1)){
            AddChanges('set', `${id}.${key}`, key, FindComponentById(componentId)?.GetBackend().changes);
            if (parent){//Update parent
                parent.offsetState(key, ((state[key] == 0) ? -1 : 1));
            }
        }
    };

    if (GetGlobal().IsNothing(parent)){
        parent = null;
    }

    let offsetState = (key: string, offset: 1 | -1, max = 0) => {
        let previousValue = state[key];

        state[key] += offset;
        state[key] = ((state[key] < 0) ? 0 : ((max <= 0 || state[key] < max) ? state[key] : max));

        if (previousValue != state[key]){
            alertUpdate(key, offset);
        }
    };

    let updateMessage = (value: string) => {
        if (value !== message){
            message = value;
            AddChanges('set', `${id}.message`, 'message', FindComponentById(componentId)?.GetBackend().changes);
        }
    };

    let getLocal = (target: HTMLElement) => {
        let local = FindComponentById(componentId)?.FindElementScope(target)?.GetLocal(localKey);
        return (GetGlobal().IsNothing(local) ? null : local);
    }

    let getArray = (value: string | Array<string>) => ((typeof value === 'string') ? [value] : value), getRoot = () => {
        return (parent ? parent.getRoot() : getLocal(contextElement));
    };
    
    let getMessage = () => {
        if (message !== null){
            FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.message`);
            return message;
        }

        return errorCallbacks.reduce((prev, callback) => [...prev, ...getArray(callback())], new Array<string>()).filter(msg => !!msg);
    };

    let isInput = (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement), local = CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && state.hasOwnProperty(prop)){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return (state[prop] > 0);
            }

            if (prop === 'message'){
                return getMessage();
            }

            if (prop === 'parent'){
                return (parent ? getLocal(<HTMLElement>contextElement.parentElement) : null);
            }

            if (prop === 'root'){
                return getRoot();
            }

            if (prop === 'reset'){
                return reset;
            }
        },
        lookup: [...Object.keys(state), 'message', 'parent', 'root', 'reset'],
    }));

    if (isInput || contextElement instanceof HTMLSelectElement){
        let initialValue = (contextElement as HTMLInputElement).value, onEvent = () => {
            offsetState('dirty', 1, 1);
            offsetState('changed', ((contextElement as HTMLInputElement).value === initialValue) ? -1 : 1, 1);
            offsetState('invalid', ((contextElement as HTMLInputElement).validity.valid ? -1 : 1), 1);
            updateMessage((contextElement as HTMLInputElement).validationMessage);
        };

        contextElement.addEventListener('change', onEvent);
        if (isInput){
            contextElement.addEventListener('input', onEvent);
        }

        message = (contextElement as HTMLInputElement).validationMessage;
        if (!(contextElement as HTMLInputElement).validity.valid){
            offsetState('invalid', 1, 1);
        }
    }
    else if (contextElement.firstElementChild){
        elementScope?.SetLocal(parentKey, { getRoot, offsetState,
            addErrorCallback: (callback: StateErrorCallbackType) => errorCallbacks.push(callback),
            removeErrorCallback: (callback: StateErrorCallbackType) => (errorCallbacks = errorCallbacks.filter(c => (c !== callback))),
            addResetCallback: (callback: () => void) => resetCallbacks.push(callback),
            removeResetCallback: (callback: StateErrorCallbackType) => (resetCallbacks = resetCallbacks.filter(c => (c !== callback))),
        });
        
        elementScope?.AddTreeChangeCallback(({ added }) => added.forEach(child => BindState(componentId, null, <HTMLElement>child)));
        [...contextElement.children].forEach((child) => {
            component?.CreateElementScope(<HTMLElement>child);
            BindState(componentId, component, <HTMLElement>child);
        });
    }

    let reset = () => {
        Object.keys(state).filter(key => (state[key] != 0)).forEach((key) => {
            state[key] = 0;
            alertUpdate(key, -1);
        });
        resetCallbacks.forEach(callback => callback());
    };

    if (!isInput && !(contextElement instanceof HTMLSelectElement) && errorCallbacks.length == 0){
        elementScope?.DeleteLocal(parentKey);
        return;//No bindings
    }

    if (parent){
        parent.addErrorCallback(getMessage);
        parent.addResetCallback(reset);

        elementScope?.AddUninitCallback(() => {
            parent.removeResetCallback(reset);
            parent.removeErrorCallback(getMessage);
        });
    }
    else{//Listen for form reset, if possible
        let form = component?.FindElement(contextElement, el => (el instanceof HTMLFormElement));
        if (form){
            form.addEventListener('reset', reset);
            elementScope?.AddUninitCallback(() => form!.removeEventListener('reset', reset));
        }
    }

    elementScope?.SetLocal(localKey, local);
}

export const StateDirectiveHandler = CreateDirectiveHandlerCallback(StateDirectiveName, ({ componentId, component, contextElement }) => {
    BindState(componentId, (component || FindComponentById(componentId)), contextElement);
});

export function StateDirectiveHandlerCompact(){
    AddDirectiveHandler(StateDirectiveHandler);
}
