import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";
import { GetCache, InitCache } from "../utilities/cache";

const cacheKey = 'InlineJS_Comp_Cache';

interface ICacheInfo{
    id: string;
    component: IComponent | null;
}

function GetDefaultCacheValue(): ICacheInfo{
    return {
        id: '',
        component: <IComponent | null>null,
    };
}

export function InitComponentCache(){
    InitCache(cacheKey, GetDefaultCacheValue());
}

export function FindComponentById(id: string){
    let cache = GetCache<ICacheInfo>(cacheKey, GetDefaultCacheValue());
    if (id === cache.id){
        return cache.component;
    }

    cache.component = GetGlobal().FindComponentById(id);
    cache.id = (cache.component ? id : '');
    
    return cache.component;
}

export function FindComponentByName(name: string){
    return GetGlobal().FindComponentByName(name);
}

export function FindComponentByRoot(root: HTMLElement){
    return GetGlobal().FindComponentByRoot(root);
}
