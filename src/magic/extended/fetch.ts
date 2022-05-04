import { ExtendedFetchConcept } from "../../concepts/fetch/extended";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { FetchPathHandlerType, IFetchMockResponseParams } from "../../types/fetch";

const ExtendedFetch = new ExtendedFetchConcept();

function CreateFetchProxy(){
    let methods = {
        install: () => GetGlobal().SetFetchConcept(ExtendedFetch),
        uninstall: () => GetGlobal().SetFetchConcept(null),
        get: (input: RequestInfo, init?: RequestInit) => ExtendedFetch.Get(input, init),
        addPathHandler: (path: string | RegExp, handler: FetchPathHandlerType) => ExtendedFetch.AddPathHandler(path, handler),
        removePathHandler: (handler: FetchPathHandlerType) => ExtendedFetch.RemovePathHandler(handler),
        mockResponse: (params: IFetchMockResponseParams) => ExtendedFetch.MockResponse(params),
    };

    return CreateReadonlyProxy(methods);
}

const FetchProxy = CreateFetchProxy();

export const FetchMagicHandler = CreateMagicHandlerCallback('fetch', () => FetchProxy);

export function FetchMagicHandlerCompact(){
    AddMagicHandler(FetchMagicHandler);
}
