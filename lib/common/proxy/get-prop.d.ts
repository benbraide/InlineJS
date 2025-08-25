import { IComponent } from "../types/component";
import { IProxy } from "../types/proxy";
export declare function GetProxyProp(componentId: string, proxy: IProxy, target: any, path: string, prop: string, noResultHandler?: (component?: IComponent, prop?: string) => any): any;
