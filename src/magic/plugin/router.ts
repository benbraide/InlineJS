import { RouterConceptName } from "../../concepts/names";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { ISplitPath } from "../../types/path";
import { IRouterConcept, IRouterFetcher, IRouterMiddleware, IRouterPageName, IRouterPageOptions, RouterProtocolHandlerType } from "../../types/router";

function CreateRouterProxy(){
    const getCollectionConcept = () => GetGlobal().GetConcept<IRouterConcept>(RouterConceptName);
    let methods = {
        setPrefix: (prefix: string) => getCollectionConcept()?.SetPrefix(prefix),
        addMiddleware: (middleware: IRouterMiddleware) => getCollectionConcept()?.AddMiddleware(middleware),
        removeMiddleware: (middleware: IRouterMiddleware | string) => getCollectionConcept()?.RemoveMiddleware(middleware),
        addFetcher: (fetcher: IRouterFetcher) => getCollectionConcept()?.AddFetcher(fetcher),
        removeFetcher: (fetcher: IRouterFetcher) => getCollectionConcept()?.RemoveFetcher(fetcher),
        addProtocolHandler: (protocol: string | RegExp, handler: RouterProtocolHandlerType) => getCollectionConcept()?.AddProtocolHandler(protocol, handler),
        removeProtocolHandler: (handler: RouterProtocolHandlerType) => getCollectionConcept()?.RemoveProtocolHandler(handler),
        addPage: (page: IRouterPageOptions) => getCollectionConcept()?.AddPage(page),
        removePage: (page: string | IRouterPageName) => getCollectionConcept()?.RemovePage(page),
        findPage: (page: string | IRouterPageName) => getCollectionConcept()?.FindPage(page),
        findMatchingPage: (path: string) => getCollectionConcept()?.FindMatchingPage(path),
        mount: (load?: boolean) => getCollectionConcept()?.Mount(load),
        goto: (path: string | ISplitPath | IRouterPageName, shouldReload?: boolean, data?: any) => getCollectionConcept()?.Goto(path, shouldReload, data),
        reload: () => getCollectionConcept()?.Reload(),
        getCurrentPath: () => getCollectionConcept()?.GetCurrentPath(),
        getActivePage: () => getCollectionConcept()?.GetActivePage(),
        getActivePageData: (key?: string) => getCollectionConcept()?.GetActivePageData(key),
    };

    return CreateReadonlyProxy(methods);
}

const RouterProxy = CreateRouterProxy();

export const RouterMagicHandler = CreateMagicHandlerCallback(RouterConceptName, () => RouterProxy);

export function RouterMagicHandlerCompact(){
    AddMagicHandler(RouterMagicHandler);
}
