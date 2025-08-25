import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";
import { UseCache } from "../utilities/cache";
import { GetDefaultCacheValue, IComponentCacheInfo } from "./cache";
import { ComponentCacheKey } from "./key";

export function FindComponentById(id: string){
    return UseCache<IComponentCacheInfo, IComponent | null>(() => {
        const component = GetGlobal().FindComponentById(id);
        return component ? { id, component } : false;
    }, ComponentCacheKey, GetDefaultCacheValue, cache => cache.id === id, cache => cache.component, () => null);
}

export function FindComponentByName(name: string){
    return GetGlobal().FindComponentByName(name);
}

export function FindComponentByRoot(root: HTMLElement|null){
    return GetGlobal().FindComponentByRoot(root);
}

export function FindComponentByCallback(callback: (component: IComponent) => boolean){
    return GetGlobal().FindComponentByCallback(callback);
}
