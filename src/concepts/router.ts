import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { ISplitPath } from "../types/path";
import { IRouterPageName, IRouterConcept, IRouterMiddleware, IRouterPage, IRouterPageOptions, IRouterFetcher, RouterProtocolHandlerType, RouterProtocolDataHandlerType } from "../types/router";
import { IUniqueMarkers } from "../types/unique-markers";
import { DeepCopy } from "../utilities/deep-copy";
import { IsObject } from "../utilities/is-object";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";
import { RouterConceptName } from "./names";
import { JoinPath, PathToRelative, SplitPath, TidyPath } from "./path";

interface IRouterProtocolHandlerInfo{
    protocol: string | RegExp;
    handler: RouterProtocolHandlerType;
}

export class RouterConcept implements IRouterConcept{
    private markers_: IUniqueMarkers = GetDefaultUniqueMarkers();
    private onEvent_: (e: PopStateEvent) => void;

    private checkpoint_ = 0;
    private active_ = false;
    
    private middlewares_: Record<string, IRouterMiddleware> = {};
    private fetchers_ = new Array<IRouterFetcher>();
    private protocolHandlers_ = new Array<IRouterProtocolHandlerInfo>();
    private pages_: Record<string, IRouterPage> = {};

    private current_ = {
        path: '',
        page: <IRouterPage | null>null,
        initialData: <any>null,
        data: <any>null,
    };

    public constructor(private prefix_ = '', private origin_ = ''){
        this.origin_ = (this.origin_ || window.location.origin);
        if (this.origin_){//Remove trailing slashes
            this.origin_ = this.origin_.replace(/\/+$/, '');
        }

        this.onEvent_ = (e) => {
            if (e.state && IsObject(e.state) && e.state.hasOwnProperty('base') && e.state.hasOwnProperty('query')){
                this.Load_(e.state, false);
            }
        };
    }
    
    public SetPrefix(prefix: string){
        this.prefix_ = prefix;
    }
    
    public AddMiddleware(middleware: IRouterMiddleware){
        this.middlewares_[middleware.GetName()] = middleware;
    }

    public RemoveMiddleware(middleware: IRouterMiddleware | string){
        let name = ((typeof middleware === 'string') ? middleware : middleware.GetName());
        if (this.middlewares_.hasOwnProperty(name)){
            delete this.middlewares_[name];
        }
    }

    public AddFetcher(fetcher: IRouterFetcher){
        this.fetchers_.push(fetcher);
    }

    public RemoveFetcher(fetcher: IRouterFetcher){
        this.fetchers_ = this.fetchers_.filter(f => (f !== fetcher));
    }

    public AddProtocolHandler(protocol: string | RegExp, handler: RouterProtocolHandlerType){
        this.protocolHandlers_.push({ protocol, handler });
    }

    public RemoveProtocolHandler(handler: RouterProtocolHandlerType){
        this.protocolHandlers_ = this.protocolHandlers_.filter(info => (info.handler !== handler));
    }
    
    public AddPage({ path, ...rest }: IRouterPageOptions){
        let id = GenerateUniqueId(this.markers_, 'router', 'page_');
        this.pages_[id] = { ...rest, id, path: ((typeof path === 'string') ? PathToRelative(path, this.origin_) : path) };
        return id;
    }

    public RemovePage(page: string | IRouterPageName){
        let found = this.FindPage(page);
        return (found ? { ...found } : null);
    }

    public FindPage(page: string | IRouterPageName): IRouterPage | null{
        if (typeof page === 'string'){
            return (this.pages_.hasOwnProperty(page) ? this.pages_[page] : null);
        }
        return (Object.values(this.pages_).find(p => (p.name === page.name)) || null);
    }

    public FindMatchingPage(path: string): IRouterPage | null{
        return (Object.values(this.pages_).find(p => ((typeof p.path === 'string') ? (p.path === path) : p.path.test(path))) || null);
    }
    
    public Mount(load?: boolean){
        window.addEventListener('popstate', this.onEvent_);

        let path = PathToRelative(window.location.href, this.origin_), split = SplitPath(path);
        if (!load){
            this.current_.path = path;
            this.current_.page = this.FindMatchingPage(split.base);
        }
        else{
            this.Load_(split, false);
        }
    }

    public Goto(path: string | ISplitPath | IRouterPageName, shouldReload?: boolean, data?: any){
        let resolvedPath: ISplitPath | null = null;
        if (typeof path !== 'string'){
            if ('name' in path){
                let page = this.FindPage(path);
                if (page && typeof page.path === 'string'){
                    resolvedPath = SplitPath(page.path, this.origin_, this.prefix_);
                }
            }
            else{//Split path
                resolvedPath = {
                    base: PathToRelative(path.base, this.origin_),
                    query: TidyPath(path.query),
                };
            }
        }
        else{//Url provided
            resolvedPath = SplitPath(path, this.origin_, this.prefix_);
        }

        if (resolvedPath){//Valid path
            this.Load_(resolvedPath, true, shouldReload, data);
        }
    }

    public Reload(){
        this.Goto(this.current_.path, true);
    }

    public GetCurrentPath(){
        return this.current_.path;
    }

    public GetActivePage(): IRouterPage | null{
        return this.current_.page;
    }

    public GetActivePageData(key?: string){
        if (key){
            return ((IsObject(this.current_.data) && this.current_.data.hasOwnProperty(key)) ? this.current_.data[key] : null);
        }
        return this.current_.data;
    }

    private FindProtocolHandler_(protocol: string){
        let info = this.protocolHandlers_.find(info => ((typeof info.protocol === 'string') ? (info.protocol === protocol) : info.protocol.test(protocol)));
        return (info ? info.handler : null);
    }

    private Load_(path: ISplitPath, pushHistory?: boolean, shouldReload?: boolean, data?: any){
        let protocolMatch = path.base.match(/^([a-zA-Z0-9_]+):\/\//), protocolHandler = (protocolMatch ? this.FindProtocolHandler_(protocolMatch[1]) : null);
        if (protocolHandler){//Truncate protocol
            path.base = path.base.substring(protocolMatch![1].length + 2);
        }
        
        let joined = JoinPath(path), protocolHandlerResponse = (protocolHandler ? protocolHandler({ protocol: protocolMatch![1], path: joined }) : null);
        if (protocolHandlerResponse === true){
            return;//Protocol handled
        }
        
        let page: IRouterPage | null = null;
        if (!protocolHandlerResponse){
            let samePath = (this.current_.path === joined);
            if (samePath && !shouldReload){
                return;
            }
            
            page = this.FindMatchingPage(path.base);
            if (!page){//Not found
                return window.dispatchEvent(new CustomEvent(`${RouterConceptName}.404`, { detail: { path: JoinPath(path) } }));
            }

            if (data){
                this.current_.initialData = DeepCopy(data);
                this.current_.data = data;
            }
            else if (samePath){//Use initial if any
                this.current_.data = (DeepCopy(this.current_.initialData) || data);
            }
            else{//Reset
                this.current_.initialData = this.current_.data = null;
            }
        }

        this.SetActiveState_(true);
        window.dispatchEvent(new CustomEvent(`${RouterConceptName}.entered`, { detail: { page: { ...page } } }));

        let doLoad = () => this.DoLoad_(checkpoint, page!, path, joined, pushHistory, ((typeof protocolHandlerResponse === 'function') ? protocolHandlerResponse : undefined));
        let checkpoint = (protocolHandlerResponse ? this.checkpoint_ : ++this.checkpoint_), checkMiddlewares = async () => {
            for (let middleware of ((typeof page!.middleware === 'string') ? [page!.middleware] : page!.middleware)!){
                if (checkpoint != this.checkpoint_ || (this.middlewares_.hasOwnProperty(middleware) && !await this.middlewares_[middleware].Handle(joined))){
                    if (checkpoint == this.checkpoint_){//Blocked
                        this.SetActiveState_(false);
                    }
                    return;//Invalid checkpoint OR blocked by middleware
                }
            }

            doLoad();
        };

        if (!protocolHandlerResponse && page!.middleware){
            checkMiddlewares();
        }
        else{//No middlewares to check
            doLoad();
        }
    }

    private DoLoad_(checkpoint: number, page: IRouterPage, path: ISplitPath, joined: string, pushHistory?: boolean, dataHandler?: RouterProtocolDataHandlerType){
        if (checkpoint != this.checkpoint_){
            return;
        }

        if (!dataHandler){
            if (page.id !== this.current_.page?.id){//New page
                document.title = (page.title || 'Untitled');
                
                this.current_.page = page;
                this.current_.path = joined;
                
                window.dispatchEvent(new CustomEvent(`${RouterConceptName}.page`, { detail: { page: { ...page } } }));
                window.dispatchEvent(new CustomEvent(`${RouterConceptName}.path`, { detail: { path: { ...path } } }));
            }
            else if (this.current_.path !== joined){
                this.current_.path = joined;
                window.dispatchEvent(new CustomEvent(`${RouterConceptName}.path`, { detail: { path: { ...path } } }));
            }
    
            if (pushHistory){
                window.history.pushState(path, (page.title || 'Untitled'), joined);
            }
        }

        let fetcher = this.fetchers_.find((fetcher) => {
            let path = fetcher.GetPath();
            return ((typeof path === 'string') ? (path === joined) : path.test(joined));
        });

        let handleData = (data: string) => {
            if (checkpoint == this.checkpoint_){
                if (!dataHandler){
                    window.dispatchEvent(new CustomEvent(`${RouterConceptName}.data`, { detail: { data, path } }));
                    window.dispatchEvent(new CustomEvent(`${RouterConceptName}.load`));
                }
                else{//Pass to handler
                    dataHandler(data);
                }
            }
            
            this.SetActiveState_(false);
        };

        let handleError = (err: any) => {
            window.dispatchEvent(new CustomEvent(`${RouterConceptName}.error`, { detail: { path } }));
            this.SetActiveState_(false);
            JournalError(err, 'InlineJS.RouterConcept.Fetch');
        };

        if (!fetcher){//Network fetch
            let reolvedPath = (this.prefix_ ? PathToRelative(joined, this.origin_, this.prefix_) : joined);
            if (dataHandler || !page.cache || !GetGlobal().GetResourceConcept()){
                fetch(reolvedPath, {
                    method: 'GET',
                    credentials: 'same-origin',
                }).then(res => res.text()).then(handleData).catch(handleError);
            }
            else{//Use resource
                GetGlobal().GetResourceConcept()?.GetData(reolvedPath, true, false).then(handleData).catch(handleError);
            }
        }
        else{//Localized fetch
            fetcher.Handle(joined).then(handleData).catch(handleError);
        }
    }

    private SetActiveState_(state: boolean){
        if (state != this.active_){
            this.active_ = state;
            window.dispatchEvent(new CustomEvent(`${RouterConceptName}.active`, { detail: { state } }));
        }
    }
}
