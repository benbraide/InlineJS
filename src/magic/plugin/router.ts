import { RouterConceptName } from "../../concepts/names";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { ISplitPath } from "../../types/path";
import { IRouterFetcher, IRouterMiddleware, IRouterPageName, IRouterPageOptions, RouterProtocolHandlerType } from "../../types/router";

function CreateRouterProxy(){
    let methods = {
        setPrefix: (prefix: string) => GetGlobal().GetRouterConcept()?.SetPrefix(prefix),
        addMiddleware: (middleware: IRouterMiddleware) => GetGlobal().GetRouterConcept()?.AddMiddleware(middleware),
        removeMiddleware: (middleware: IRouterMiddleware | string) => GetGlobal().GetRouterConcept()?.RemoveMiddleware(middleware),
        addFetcher: (fetcher: IRouterFetcher) => GetGlobal().GetRouterConcept()?.AddFetcher(fetcher),
        removeFetcher: (fetcher: IRouterFetcher) => GetGlobal().GetRouterConcept()?.RemoveFetcher(fetcher),
        addProtocolHandler: (protocol: string | RegExp, handler: RouterProtocolHandlerType) => GetGlobal().GetRouterConcept()?.AddProtocolHandler(protocol, handler),
        removeProtocolHandler: (handler: RouterProtocolHandlerType) => GetGlobal().GetRouterConcept()?.RemoveProtocolHandler(handler),
        addPage: (page: IRouterPageOptions) => GetGlobal().GetRouterConcept()?.AddPage(page),
        removePage: (page: string | IRouterPageName) => GetGlobal().GetRouterConcept()?.RemovePage(page),
        findPage: (page: string | IRouterPageName) => GetGlobal().GetRouterConcept()?.FindPage(page),
        findMatchingPage: (path: string) => GetGlobal().GetRouterConcept()?.FindMatchingPage(path),
        mount: (load?: boolean) => GetGlobal().GetRouterConcept()?.Mount(load),
        goto: (path: string | ISplitPath | IRouterPageName, shouldReload?: boolean, data?: any) => GetGlobal().GetRouterConcept()?.Goto(path, shouldReload, data),
        reload: () => GetGlobal().GetRouterConcept()?.Reload(),
        getCurrentPath: () => GetGlobal().GetRouterConcept()?.GetCurrentPath(),
        getActivePage: () => GetGlobal().GetRouterConcept()?.GetActivePage(),
        getActivePageData: (key?: string) => GetGlobal().GetRouterConcept()?.GetActivePageData(key),
    };

    return CreateReadonlyProxy(methods);
}

const RouterProxy = CreateRouterProxy();

export const RouterMagicHandler = CreateMagicHandlerCallback(RouterConceptName, () => RouterProxy);

export function RouterMagicHandlerCompact(){
    AddMagicHandler(RouterMagicHandler);
}
