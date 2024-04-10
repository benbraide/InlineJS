import { IComponent } from "../types/component";
export interface IComponentCacheInfo {
    id: string;
    component: IComponent | null;
}
export declare function GetDefaultCacheValue(): IComponentCacheInfo;
export declare function InitComponentCache(): void;
