import { FindComponentById } from "../component/find";
import { StoreProxyHandler } from "../component/set-proxy-access-handler";
import { IElementScope } from "../types/element-scope";
import { SubscribeCallbackType, SubscribeToChanges, SubscriptionsCallbackType } from "./subscribe";
import { GetGlobal } from "../global/get";
import { ProxyAccessStorage } from "../storage/get-access";

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

        let canceled = false, elScope: IElementScope | null = null, cancel = () => {
            canceled = true;
        };

        if (contextElement){
            elScope = (contextElement instanceof HTMLElement) ? component.CreateElementScope(contextElement) : component.FindElementScope(contextElement);
        }

        const proxyAccessStorage = new ProxyAccessStorage;
        GetGlobal().UseProxyAccessStorage(() => {
            callback({
                changes: [],
                cancel: cancel,
            });
        }, proxyAccessStorage);

        !canceled && SubscribeToChanges({
            componentId, proxyAccessStorage, subscriptionsCallback,
            callback: details => storedProxyHandler(() => callback(details)),
            contextElement: elScope?.GetElement()
        });
    };

    if (options?.nextTick){
        FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(watch);
    }
    else{//Immediate watch
        watch();
    }
}
