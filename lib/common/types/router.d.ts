import { ISplitPath } from "./path";
export interface IRouterPageName {
    name: string;
}
export interface IRouterPageOptions {
    path: string | RegExp;
    name?: string;
    title?: string;
    middleware?: string | Array<string>;
    cache?: boolean;
}
export interface IRouterPage extends IRouterPageOptions {
    id: string;
}
export interface IRouterMiddleware {
    GetName(): string;
    Handle(path: string): Promise<boolean>;
}
export interface IRouterFetcher {
    GetPath(): string | RegExp;
    Handle(path: string): Promise<string>;
}
export interface IRouterProtocolHandlerParams {
    protocol: string;
    path: string;
}
export declare type RouterProtocolDataHandlerType = (data: string) => void;
export declare type RouterProtocolHandlerResponseType = void | boolean | RouterProtocolDataHandlerType;
export declare type RouterProtocolHandlerType = (params: IRouterProtocolHandlerParams) => RouterProtocolHandlerResponseType;
export interface IRouterConcept {
    SetPrefix(prefix: string): void;
    AddMiddleware(middleware: IRouterMiddleware): void;
    RemoveMiddleware(middleware: IRouterMiddleware | string): void;
    AddFetcher(fetcher: IRouterFetcher): void;
    RemoveFetcher(fetcher: IRouterFetcher): void;
    AddProtocolHandler(protocol: string | RegExp, handler: RouterProtocolHandlerType): void;
    RemoveProtocolHandler(handler: RouterProtocolHandlerType): void;
    AddPage(options: IRouterPageOptions): string;
    RemovePage(page: string | IRouterPageName): void;
    FindPage(page: string | IRouterPageName): IRouterPage | null;
    FindMatchingPage(path: string): IRouterPage | null;
    Mount(load?: boolean): void;
    Goto(path: string | ISplitPath | IRouterPageName, shouldReload?: boolean, data?: any): void;
    Reload(): void;
    GetCurrentPath(): string;
    GetActivePage(): IRouterPage | null;
    GetActivePageData(key?: string): any;
}
