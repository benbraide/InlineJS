import { RouterConceptName } from "../../concepts/names";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
function CreateRouterProxy() {
    const getCollectionConcept = () => GetGlobal().GetConcept(RouterConceptName);
    let methods = {
        setPrefix: (prefix) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.SetPrefix(prefix); },
        addMiddleware: (middleware) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.AddMiddleware(middleware); },
        removeMiddleware: (middleware) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.RemoveMiddleware(middleware); },
        addFetcher: (fetcher) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.AddFetcher(fetcher); },
        removeFetcher: (fetcher) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.RemoveFetcher(fetcher); },
        addProtocolHandler: (protocol, handler) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.AddProtocolHandler(protocol, handler); },
        removeProtocolHandler: (handler) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.RemoveProtocolHandler(handler); },
        addPage: (page) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.AddPage(page); },
        removePage: (page) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.RemovePage(page); },
        findPage: (page) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.FindPage(page); },
        findMatchingPage: (path) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.FindMatchingPage(path); },
        mount: (load) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Mount(load); },
        goto: (path, shouldReload, data) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Goto(path, shouldReload, data); },
        reload: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Reload(); },
        getCurrentPath: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetCurrentPath(); },
        getActivePage: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetActivePage(); },
        getActivePageData: (key) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetActivePageData(key); },
    };
    return CreateReadonlyProxy(methods);
}
const RouterProxy = CreateRouterProxy();
export const RouterMagicHandler = CreateMagicHandlerCallback(RouterConceptName, () => RouterProxy);
export function RouterMagicHandlerCompact() {
    AddMagicHandler(RouterMagicHandler);
}
