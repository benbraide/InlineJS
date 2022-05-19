import { IFetchConcept } from "../types/fetch";
export declare class NativeFetchConcept implements IFetchConcept {
    Get(input: RequestInfo, init?: RequestInit): Promise<Response>;
}
