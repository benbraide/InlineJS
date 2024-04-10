import { IComponent } from "../types/component";
import { InitCache } from "../utilities/cache";
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
