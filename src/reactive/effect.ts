import { FindComponentById } from "../component/find";
import { JournalError } from "../journal/error";
import { IBubbledChange, IChange } from "../types/change";
import { SubscribeCallbackType, SubscribeToChanges, SubscriptionsCallbackType } from "./subscribe";

export interface IUseEffectOptions{
    nextTick?: boolean;
}

export interface IUseEffectInfo{
    componentId: string;
    callback: SubscribeCallbackType;
    contextElement: HTMLElement | string | null;
    options?: IUseEffectOptions;
    subscriptionsCallback?: SubscriptionsCallbackType;
}

export function UseEffect({ componentId, callback, contextElement, options, subscriptionsCallback } : IUseEffectInfo){
    let watch = () => {
        let component = FindComponentById(componentId);
        if (!component){
            return;
        }

        let { changes } = component.GetBackend(), canceled = false, elScope = (contextElement ? component.FindElementScope(contextElement) : null), cancel = () => {
            canceled = true;
        };

        let element = elScope?.GetElement();
        try{
            changes.PushGetAccessStorage();//Push new storage onto the stack
            callback({
                changes: [],
                cancel: cancel,
            });
        }
        catch (err){
            JournalError(err, `InlineJS.Component<${componentId}>.UseEffect`, element);
        }

        if (canceled){//Pop storage
            changes.PopAllGetAccessStorageSnapshots(false);//Remove all outstanding checkpoints
            changes.RestoreOptimizedGetAccessStorage();//Restore previously swapped optimized storage
            changes.PopGetAccessStorage();
            return;
        }

        let unsubscribeAll = SubscribeToChanges(componentId, changes, callback, subscriptionsCallback);
        if (unsubscribeAll){
            elScope?.AddUninitCallback(unsubscribeAll);
        }
    };

    if (options?.nextTick){
        FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(watch);
    }
    else{//Immediate watch
        watch();
    }
}
