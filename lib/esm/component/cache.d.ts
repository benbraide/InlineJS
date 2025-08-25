import { IComponent } from "../types/component";
export interface IComponentCacheInfo {
    id: string;
    component: IComponent | null;
}
export declare function GetDefaultCacheValue(): IComponentCacheInfo;
export declare function InitComponentCache(): void;
/**
 * Invalidates a specific component's entry in the cache.
 * @param id The ID of the component to invalidate.
 */
export declare function InvalidateComponentCache(id: string): void;
