export type ProxyLookupType = Array<string> | ((prop: string, target?: any) => boolean);
export interface IProxyAlertOptions {
    componentId: string;
    id: string;
    list?: Array<string>;
}
export interface IProxyOptions {
    target?: Record<string, any> | Array<any>;
    getter?: (prop?: string, target?: any) => any;
    setter?: (prop?: string, value?: any, target?: any) => boolean;
    deleter?: (prop?: string, target?: any) => boolean;
    lookup?: ProxyLookupType;
    alert?: IProxyAlertOptions;
}
export declare function CreateInplaceProxy({ target, getter, setter, deleter, lookup, alert }: IProxyOptions): object;
export declare function CreateReadonlyProxy(target: Array<any> | Record<string, any>): object;
export declare function DisableProxyAction(): boolean;
export declare function BuildProxyOptions({ setter, deleter, lookup, ...rest }: IProxyOptions): IProxyOptions;
export interface IGetterProxyOptions {
    getter?: (prop?: string, target?: any) => any;
    lookup?: ProxyLookupType;
    alert?: IProxyAlertOptions;
}
export declare function BuildGetterProxyOptions(options: IGetterProxyOptions): IProxyOptions;
