import { JournalTry } from "../journal/try";
import { FindComponentById } from "./find";
export function SetProxyAccessHandler(component, proxyHandler) {
    if (!proxyHandler) {
        return () => { };
    }
    const handler = (('handler' in proxyHandler) ? proxyHandler.handler : proxyHandler);
    if (!handler) {
        return () => { };
    }
    const resolvedComponent = ((typeof component === 'string') ? FindComponentById(component) : component);
    if (!resolvedComponent) {
        return () => { };
    }
    const oldProxyHandler = (resolvedComponent.SetProxyAccessHandler(handler || null) || null);
    return () => (proxyHandler && resolvedComponent.SetProxyAccessHandler(oldProxyHandler));
}
export function StoreProxyHandler(component) {
    var _a;
    const currentHandler = (_a = ((typeof component === 'string') ? FindComponentById(component) : component)) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
    return (callback) => {
        const pahCallback = SetProxyAccessHandler(component, (currentHandler || null));
        JournalTry(callback);
        pahCallback();
    };
}
