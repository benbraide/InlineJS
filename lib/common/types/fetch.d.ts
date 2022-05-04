export interface IFetchConcept {
    Get(input: RequestInfo, init?: RequestInit): Promise<Response>;
}
