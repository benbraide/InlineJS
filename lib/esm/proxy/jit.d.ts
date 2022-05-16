import { IComponent } from "../types/component";
export declare type JITProxyInstanceType = Record<string, object>;
export declare function InitJITProxy(key: string, component: IComponent | null, element: HTMLElement): [string, any, JITProxyInstanceType | null];
