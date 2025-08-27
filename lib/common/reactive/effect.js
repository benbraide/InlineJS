"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseEffect = void 0;
const find_1 = require("../component/find");
const set_proxy_access_handler_1 = require("../component/set-proxy-access-handler");
const subscribe_1 = require("./subscribe");
const get_1 = require("../global/get");
const get_access_1 = require("../storage/get-access");
function UseEffect({ componentId, callback, contextElement, options, subscriptionsCallback, cancelCallback }) {
    var _a;
    const storedProxyHandler = (0, set_proxy_access_handler_1.StoreProxyHandler)(componentId), watch = () => {
        const component = (0, find_1.FindComponentById)(componentId);
        if (!component) {
            return;
        }
        let canceled = false, elScope = null, cancel = () => {
            canceled = true;
        };
        if (contextElement) {
            elScope = (contextElement instanceof HTMLElement) ? component.CreateElementScope(contextElement) : component.FindElementScope(contextElement);
        }
        const proxyAccessStorage = new get_access_1.ProxyAccessStorage;
        (0, get_1.GetGlobal)().UseProxyAccessStorage(() => {
            callback({
                changes: [],
                cancel: cancel,
            });
        }, proxyAccessStorage);
        const unsubscribe = !canceled && (0, subscribe_1.SubscribeToChanges)({
            componentId, proxyAccessStorage, subscriptionsCallback,
            callback: details => storedProxyHandler(() => callback(details)),
            contextElement: elScope === null || elScope === void 0 ? void 0 : elScope.GetElement()
        });
        if (unsubscribe && cancelCallback) {
            cancelCallback(cancel);
        }
    };
    if (options === null || options === void 0 ? void 0 : options.nextTick) {
        (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(watch);
    }
    else { //Immediate watch
        watch();
    }
}
exports.UseEffect = UseEffect;
