import { FetchPathHandlerType, IExtendedFetchConcept, IFetchMockResponseParams } from "../../types/fetch";
import { NativeFetchConcept } from "./native";
export declare class ExtendedFetchConcept extends NativeFetchConcept implements IExtendedFetchConcept {
    private handlers_;
    Get(input: RequestInfo, init?: RequestInit): Promise<Response>;
    AddPathHandler(path: string | RegExp, handler: FetchPathHandlerType): void;
    RemovePathHandler(handler: FetchPathHandlerType): void;
    MockResponse({ response, delay, errorText }: IFetchMockResponseParams): Promise<Response>;
    private FindPathHandler_;
}
