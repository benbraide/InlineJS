import { IComponent } from "../types/component";
import { InitCache, GetCache, InvalidateCache } from "../utilities/cache";
import { ComponentCacheKey } from "./key";

export interface IComponentCacheInfo{
    id: string;
    component: IComponent | null;
}

export function GetDefaultCacheValue(): IComponentCacheInfo{
    return {
        id: '',
        component: <IComponent | null>null,
    };
}

export function InitComponentCache(){
    InitCache(ComponentCacheKey, GetDefaultCacheValue());
}

/**
 * Invalidates a specific component's entry in the cache.
 * @param id The ID of the component to invalidate.
 */
export function InvalidateComponentCache(id: string){
    GetCache<IComponentCacheInfo>(ComponentCacheKey, GetDefaultCacheValue).id === id && InvalidateCache(ComponentCacheKey);
}
