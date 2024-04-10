import { JournalTry } from "../journal/try";
import { IComponent } from "../types/component";
import { IDirectiveProxyAccessHandler } from "../types/directive";
import { IProxyAccessHandler } from "../types/proxy";
import { FindComponentById } from "./find";

export function SetProxyAccessHandler(component: IComponent | string | null, proxyHandler: IProxyAccessHandler | IDirectiveProxyAccessHandler | null){
    if (!proxyHandler){
        return () => {};
    }

    const handler = (('handler' in proxyHandler) ? proxyHandler.handler : <IProxyAccessHandler>proxyHandler);
    if (!handler){
        return () => {};
    }
    
    const resolvedComponent = ((typeof component === 'string') ? FindComponentById(component) : component);
    if (!resolvedComponent){
        return () => {};
    }
    
    const oldProxyHandler = (resolvedComponent.SetProxyAccessHandler(handler || null) || null);

    return () => (proxyHandler && resolvedComponent.SetProxyAccessHandler(oldProxyHandler));
}

export function StoreProxyHandler(component: IComponent | string | null){
    const currentHandler = ((typeof component === 'string') ? FindComponentById(component) : component)?.GetProxyAccessHandler();
    return (callback: () => void) => {
        const pahCallback = SetProxyAccessHandler(component, (currentHandler || null));
        JournalTry(callback);
        pahCallback();
    };
}
