import { IComponent } from "../types/component";

export type JITProxyInstanceType = Record<string, object>;

type JITProxyGlobalType = Record<string, JITProxyInstanceType>;

const InlineJS_JITProxy_Key = 'InlineJS_ProxyGlobal'

function GetJITProxyGlobalBlock(): JITProxyGlobalType{
    return (globalThis[InlineJS_JITProxy_Key] = (globalThis[InlineJS_JITProxy_Key] || {}));
}

export function InitJITProxy(key: string, component: IComponent | null, element: HTMLElement): [string, any, JITProxyInstanceType | null]{
    let elementScope = component?.FindElementScope(element), elementKey = elementScope?.GetId();
    if (!elementKey){
        return ['', null, null];
    }

    let global = GetJITProxyGlobalBlock(), scope = (global[key] = (global[key] || {}));
    if (elementKey in scope){
        return [elementKey, scope[elementKey], scope];
    }

    elementScope?.AddUninitCallback(() => (delete scope[elementKey!]));

    return [elementKey, null, scope];
}
