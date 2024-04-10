"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreProxyHandler = exports.SetProxyAccessHandler = void 0;
const try_1 = require("../journal/try");
const find_1 = require("./find");
function SetProxyAccessHandler(component, proxyHandler) {
    if (!proxyHandler) {
        return () => { };
    }
    const handler = (('handler' in proxyHandler) ? proxyHandler.handler : proxyHandler);
    if (!handler) {
        return () => { };
    }
    const resolvedComponent = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component);
    if (!resolvedComponent) {
        return () => { };
    }
    const oldProxyHandler = (resolvedComponent.SetProxyAccessHandler(handler || null) || null);
    return () => (proxyHandler && resolvedComponent.SetProxyAccessHandler(oldProxyHandler));
}
exports.SetProxyAccessHandler = SetProxyAccessHandler;
function StoreProxyHandler(component) {
    var _a;
    const currentHandler = (_a = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component)) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
    return (callback) => {
        const pahCallback = SetProxyAccessHandler(component, (currentHandler || null));
        (0, try_1.JournalTry)(callback);
        pahCallback();
    };
}
exports.StoreProxyHandler = StoreProxyHandler;
