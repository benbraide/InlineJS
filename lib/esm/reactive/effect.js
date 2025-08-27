import { FindComponentById } from "../component/find";
import { StoreProxyHandler } from "../component/set-proxy-access-handler";
import { SubscribeToChanges } from "./subscribe";
import { GetGlobal } from "../global/get";
import { ProxyAccessStorage } from "../storage/get-access";
export function UseEffect({ componentId, callback, contextElement, options, subscriptionsCallback, cancelCallback }) {
    var _a;
    const storedProxyHandler = StoreProxyHandler(componentId), watch = () => {
        const component = FindComponentById(componentId);
        if (!component) {
            return;
        }
        let canceled = false, elScope = null, cancel = () => {
            canceled = true;
        };
        if (contextElement) {
            elScope = (contextElement instanceof HTMLElement) ? component.CreateElementScope(contextElement) : component.FindElementScope(contextElement);
        }
        const proxyAccessStorage = new ProxyAccessStorage;
        GetGlobal().UseProxyAccessStorage(() => {
            callback({
                changes: [],
                cancel: cancel,
            });
        }, proxyAccessStorage);
        const unsubscribe = !canceled && SubscribeToChanges({
            componentId, proxyAccessStorage, subscriptionsCallback,
            callback: details => storedProxyHandler(() => callback(details)),
            contextElement: elScope === null || elScope === void 0 ? void 0 : elScope.GetElement()
        });
        if (unsubscribe && cancelCallback) {
            cancelCallback(cancel);
        }
    };
    if (options === null || options === void 0 ? void 0 : options.nextTick) {
        (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(watch);
    }
    else { //Immediate watch
        watch();
    }
}
