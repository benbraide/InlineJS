import { FindComponentById } from "../component/find";
import { JournalError } from "../journal/error";
import { IBubbledChange, IChange } from "../types/change";
import { IChanges } from "../types/changes";

export interface ISubscribeDetails{
    changes: Array<IChange | IBubbledChange>;
    cancel: () => void;
}

export type SubscriptionsCallbackType = (list: Record<string, Array<string>>) => void;
export type SubscribeCallbackType = (details?: ISubscribeDetails) => void | boolean;

export interface ISubscribeToChangesParams{
    componentId: string;
    changes: IChanges;
    callback: SubscribeCallbackType;
    subscriptionsCallback?: SubscriptionsCallbackType;
    contextElement?: HTMLElement;
}

export function SubscribeToChanges({ componentId, changes, callback, subscriptionsCallback, contextElement }: ISubscribeToChangesParams){
    changes.PopAllGetAccessStorageSnapshots(false);//Remove all outstanding checkpoints
    changes.RestoreOptimizedGetAccessStorage();//Restore previously swapped optimized storage

    const { optimized, raw } = changes.PopGetAccessStorage()!;
    if (((optimized || raw)?.entries.length || 0) == 0){
        if (subscriptionsCallback){//Alert no subscriptions
            subscriptionsCallback({});
        }
        return null;
    }

    let subscriptionIds: Record<string, Array<string>> = {}, unsubscribeAll = () => {
        Object.keys(subscriptionIds).map(componentId => FindComponentById(componentId)).filter(component => !!component).forEach((component) => {
            const { changes } = component!.GetBackend();
            subscriptionIds[component!.GetId()].forEach(subscriptionId => changes.Unsubscribe(subscriptionId));
        });
        subscriptionIds = {};
    };

    let canceled = false, cancel = () => {
        canceled = true;
    };

    const onChange = (list?: Array<IChange | IBubbledChange>) => {
        const component = FindComponentById(componentId);
        if (!component || canceled){
            unsubscribeAll();
            return;
        }
        
        const { changes } = component.GetBackend();
        changes.PushOrigin(onChange);

        try{
            callback({
                changes: (list || []),
                cancel: cancel,
            });
        }
        catch (err){
            JournalError(err, `InlineJS.Component<${componentId}>.SubscribeToChanges.OnChange`);
        }

        changes.PopOrigin();
        if (canceled){
            unsubscribeAll();
        }
    };

    const uniqueEntries: Record<string, Record<string, boolean>> = {};//Extract unique path-componentId pairs
    (optimized || raw)?.entries.forEach(details => ((uniqueEntries[details.path] = (uniqueEntries[details.path] || {}))[details.compnentId] = true));

    Object.entries(uniqueEntries).forEach(([path, compnentIds]) => {
        Object.keys(compnentIds).map(componentId => FindComponentById(componentId)).filter(component => !!component).forEach((component) => {
            (subscriptionIds[component!.GetId()] = (subscriptionIds[component!.GetId()] || [])).push(component!.GetBackend().changes.Subscribe(path, onChange));
        });
    });

    if (contextElement){
        FindComponentById(componentId)?.FindElementScope(contextElement)?.AddUninitCallback(() => {
            cancel();
            unsubscribeAll();
        });
    }

    if (subscriptionsCallback){//Alert all subscriptions
        subscriptionsCallback(subscriptionIds);
    }

    return unsubscribeAll;
}
