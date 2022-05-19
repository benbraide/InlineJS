import { IFetchConcept } from "../types/fetch";

export class NativeFetchConcept implements IFetchConcept{
    public Get(input: RequestInfo, init?: RequestInit){
        return fetch(input, init);
    }
}
