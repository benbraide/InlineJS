import { FindComponentById } from "../component/find";
import { SetProxyAccessHandler, StoreProxyHandler } from "../component/set-proxy-access-handler";
import { JournalError } from "../journal/error";
import { JournalTry } from "../journal/try";
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
    const storedProxyHandler = StoreProxyHandler(componentId), watch = () => {
        const component = FindComponentById(componentId);
        if (!component){
            return;
        }

        let canceled = false;
        const { changes } = component.GetBackend(), elScope = (contextElement ? component.FindElementScope(contextElement) : null), cancel = () => {
            canceled = true;
        };

        const element = elScope?.GetElement();
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

        SubscribeToChanges({ componentId, changes, callback: details => storedProxyHandler(() => callback(details)), subscriptionsCallback, contextElement: element });
    };

    if (options?.nextTick){
        FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(watch);
    }
    else{//Immediate watch
        watch();
    }
}
