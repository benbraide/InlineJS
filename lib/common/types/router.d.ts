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
export declare type RouterProtocolHandlerType = (protocol: string, path: string) => void | boolean;
export interface IRouterConcept {
    SetPrefix(prefix: string): void;
    AddMiddleware(middleware: IRouterMiddleware): void;
    RemoveMiddleware(middleware: IRouterMiddleware | string): void;
    AddFetcher(fetcher: IRouterFetcher): void;
    RemoveFetcher(fetcher: IRouterFetcher): void;
    AddProtocolHandler(handler: RouterProtocolHandlerType): void;
    RemoveProtocolHandler(handler: RouterProtocolHandlerType): void;
    AddPage(options: IRouterPageOptions): string;
    RemovePage(page: string | IRouterPageName): void;
    FindPage(page: string | IRouterPageName): IRouterPage | null;
    FindMatchingPage(path: string): IRouterPage | null;
    Mount(load?: boolean): void;
    Goto(path: string | ISplitPath | IRouterPageName, shouldReload?: boolean): void;
    Reload(): void;
    GetCurrentPath(): string;
    GetActivePage(): IRouterPage | null;
}
