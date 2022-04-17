import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";

const cacheKey = 'InlineJS_Comp_Cache';

interface ICacheInfo{
    id: string;
    component: IComponent | null;
}

export function InitComponentCache(){
    return globalThis[cacheKey] = {
        id: '',
        component: <IComponent | null>null
    };
}

export function FindComponentById(id: string){
    let cache = <ICacheInfo>(globalThis[cacheKey] = (globalThis[cacheKey] || InitComponentCache()));
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
