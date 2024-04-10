"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseEffect = void 0;
const find_1 = require("../component/find");
const set_proxy_access_handler_1 = require("../component/set-proxy-access-handler");
const error_1 = require("../journal/error");
const subscribe_1 = require("./subscribe");
function UseEffect({ componentId, callback, contextElement, options, subscriptionsCallback }) {
    var _a;
    const storedProxyHandler = (0, set_proxy_access_handler_1.StoreProxyHandler)(componentId), watch = () => {
        const component = (0, find_1.FindComponentById)(componentId);
        if (!component) {
            return;
        }
        let canceled = false;
        const { changes } = component.GetBackend(), elScope = (contextElement ? component.FindElementScope(contextElement) : null), cancel = () => {
            canceled = true;
        };
        const element = elScope === null || elScope === void 0 ? void 0 : elScope.GetElement();
        try {
            changes.PushGetAccessStorage(); //Push new storage onto the stack
            callback({
                changes: [],
                cancel: cancel,
            });
        }
        catch (err) {
            (0, error_1.JournalError)(err, `InlineJS.Component<${componentId}>.UseEffect`, element);
        }
        if (canceled) { //Pop storage
            changes.PopAllGetAccessStorageSnapshots(false); //Remove all outstanding checkpoints
            changes.RestoreOptimizedGetAccessStorage(); //Restore previously swapped optimized storage
            changes.PopGetAccessStorage();
            return;
        }
        (0, subscribe_1.SubscribeToChanges)({ componentId, changes, callback: details => storedProxyHandler(() => callback(details)), subscriptionsCallback, contextElement: element });
    };
    if (options === null || options === void 0 ? void 0 : options.nextTick) {
        (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(watch);
    }
    else { //Immediate watch
        watch();
    }
}
exports.UseEffect = UseEffect;
