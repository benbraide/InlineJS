export interface IFetchConcept {
    Get(input: RequestInfo, init?: RequestInit): Promise<Response>;
}
export interface IFetchPathHandlerParams {
    input: RequestInfo;
    init?: RequestInit;
}
export declare type FetchPathHandlerType = (params: IFetchPathHandlerParams) => Promise<Response> | null;
export interface IFetchMockResponseParams {
    response: any;
    delay?: number;
    errorText?: (() => string) | string;
}
export interface IExtendedFetchConcept {
    AddPathHandler(path: string | RegExp, handler: FetchPathHandlerType): void;
    RemovePathHandler(handler: FetchPathHandlerType): void;
    MockResponse(params: IFetchMockResponseParams): Promise<Response>;
}
