import { FindComponentById } from "../component/find";
import { JournalError } from "../journal/error";
import { IBubbledChange, IChange } from "../types/change";
import { IChanges } from "../types/changes";
import { IProxyAccessStorage } from "../types/storage";

export interface ISubscribeDetails{
    changes: Array<IChange | IBubbledChange>;
    cancel: () => void;
}

export type SubscriptionsCallbackType = (list: Record<string, Array<string>>) => void;
export type SubscribeCallbackType = (details?: ISubscribeDetails) => void | boolean;

export interface ISubscribeToChangesParams{
    componentId: string;
    proxyAccessStorage: IProxyAccessStorage;
    callback: SubscribeCallbackType;
    subscriptionsCallback?: SubscriptionsCallbackType;
    contextElement?: HTMLElement;
}

export function SubscribeToChanges({ componentId, proxyAccessStorage, callback, subscriptionsCallback, contextElement }: ISubscribeToChangesParams){
    if (proxyAccessStorage.IsEmpty()){// No reactive access
        subscriptionsCallback?.({});
        return null;
    }

    let subscriptionIds: Record<string, Array<string>> = {}, unsubscribeAll = () => {
        for (const cId in subscriptionIds){
            const component = FindComponentById(cId);
            if (!component){
                continue;
            }

            const { changes } = component.GetBackend();
            subscriptionIds[cId].forEach(id => changes.Unsubscribe(id));
        }
        
        subscriptionIds = {};
    };

    let canceled = false, cancel = () => {
        canceled = true;
    };

    const onChange = (list: Array<IChange | IBubbledChange>) => {
        const component = FindComponentById(componentId);
        if (!component || canceled){
            unsubscribeAll();
            return;
        }
        
        const { changes } = component.GetBackend();
        changes.PushOrigin(onChange);

        try{
            callback({
                changes: list,
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

    const groupedEntries = proxyAccessStorage.GetGroupedEntries();
    
    for (const cId in groupedEntries){
        const component = FindComponentById(cId);
        if (!component){
            continue;
        }
        
        const newSubscriptionIds = new Array<string>(), { changes } = component.GetBackend();
        groupedEntries[cId].forEach(details => newSubscriptionIds.push(changes.Subscribe(details.path, onChange)));

        subscriptionIds[cId] = newSubscriptionIds;
    }

    if (contextElement){// Unsubscribe all when element is destroyed
        FindComponentById(componentId)?.FindElementScope(contextElement)?.AddMarkedCallback(() => {
            cancel();
            unsubscribeAll();
        });
    }

    subscriptionsCallback?.(subscriptionIds);

    return unsubscribeAll;
}
