import { ExtendedFetchConcept } from "../../concepts/fetch/extended";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
const ExtendedFetch = new ExtendedFetchConcept();
function CreateFetchProxy() {
    let methods = {
        install: () => GetGlobal().SetFetchConcept(ExtendedFetch),
        uninstall: () => GetGlobal().SetFetchConcept(null),
        get: (input, init) => ExtendedFetch.Get(input, init),
        addPathHandler: (path, handler) => ExtendedFetch.AddPathHandler(path, handler),
        removePathHandler: (handler) => ExtendedFetch.RemovePathHandler(handler),
        mockResponse: (params) => ExtendedFetch.MockResponse(params),
    };
    return CreateReadonlyProxy(methods);
}
const FetchProxy = CreateFetchProxy();
export const FetchMagicHandler = CreateMagicHandlerCallback('fetch', () => FetchProxy);
export function FetchMagicHandlerCompact() {
    AddMagicHandler(FetchMagicHandler);
}
