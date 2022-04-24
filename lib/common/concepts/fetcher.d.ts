import { IRouterFetcher } from "../types/router";
export declare class RouterFetcher implements IRouterFetcher {
    private path_;
    private handler_;
    constructor(path_: string | RegExp, handler_: (path: string) => Promise<string>);
    GetPath(): string | RegExp;
    Handle(path: string): Promise<string>;
}
