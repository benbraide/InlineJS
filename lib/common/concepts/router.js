"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterConcept = void 0;
const get_1 = require("../global/get");
const error_1 = require("../journal/error");
const deep_copy_1 = require("../utilities/deep-copy");
const is_object_1 = require("../utilities/is-object");
const unique_markers_1 = require("../utilities/unique-markers");
const names_1 = require("./names");
const path_1 = require("./path");
class RouterConcept {
    constructor(prefix_ = '', origin_ = '') {
        this.prefix_ = prefix_;
        this.origin_ = origin_;
        this.markers_ = (0, unique_markers_1.GetDefaultUniqueMarkers)();
        this.checkpoint_ = 0;
        this.active_ = false;
        this.middlewares_ = {};
        this.fetchers_ = new Array();
        this.protocolHandlers_ = new Array();
        this.pages_ = {};
        this.current_ = {
            path: '',
            page: null,
            initialData: null,
            data: null,
        };
        this.origin_ = (this.origin_ || window.location.origin);
        if (this.origin_) { //Remove trailing slashes
            this.origin_ = this.origin_.replace(/\/+$/, '');
        }
        this.onEvent_ = (e) => {
            if (e.state && (0, is_object_1.IsObject)(e.state) && e.state.hasOwnProperty('base') && e.state.hasOwnProperty('query')) {
                this.Load_(e.state, false);
            }
        };
    }
    SetPrefix(prefix) {
        this.prefix_ = prefix;
    }
    AddMiddleware(middleware) {
        this.middlewares_[middleware.GetName()] = middleware;
    }
    RemoveMiddleware(middleware) {
        let name = ((typeof middleware === 'string') ? middleware : middleware.GetName());
        if (this.middlewares_.hasOwnProperty(name)) {
            delete this.middlewares_[name];
        }
    }
    AddFetcher(fetcher) {
        this.fetchers_.push(fetcher);
    }
    RemoveFetcher(fetcher) {
        this.fetchers_ = this.fetchers_.filter(f => (f !== fetcher));
    }
    AddProtocolHandler(protocol, handler) {
        this.protocolHandlers_.push({ protocol, handler });
    }
    RemoveProtocolHandler(handler) {
        this.protocolHandlers_ = this.protocolHandlers_.filter(info => (info.handler !== handler));
    }
    AddPage(_a) {
        var { path } = _a, rest = __rest(_a, ["path"]);
        let id = (0, unique_markers_1.GenerateUniqueId)(this.markers_, 'router', 'page_');
        this.pages_[id] = Object.assign(Object.assign({}, rest), { id, path: ((typeof path === 'string') ? (0, path_1.PathToRelative)(path, this.origin_) : path) });
        return id;
    }
    RemovePage(page) {
        let found = this.FindPage(page);
        return (found ? Object.assign({}, found) : null);
    }
    FindPage(page) {
        if (typeof page === 'string') {
            return (this.pages_.hasOwnProperty(page) ? this.pages_[page] : null);
        }
        return (Object.values(this.pages_).find(p => (p.name === page.name)) || null);
    }
    FindMatchingPage(path) {
        return (Object.values(this.pages_).find(p => ((typeof p.path === 'string') ? (p.path === path) : p.path.test(path))) || null);
    }
    Mount(load) {
        window.addEventListener('popstate', this.onEvent_);
        let path = (0, path_1.PathToRelative)(window.location.href, this.origin_), split = (0, path_1.SplitPath)(path);
        if (!load) {
            this.current_.path = path;
            this.current_.page = this.FindMatchingPage(split.base);
        }
        else {
            this.Load_(split, false);
        }
    }
    Goto(path, shouldReload, data) {
        let resolvedPath = null;
        if (typeof path !== 'string') {
            if ('name' in path) {
                let page = this.FindPage(path);
                if (page && typeof page.path === 'string') {
                    resolvedPath = (0, path_1.SplitPath)(page.path, this.origin_, this.prefix_);
                }
            }
            else { //Split path
                resolvedPath = {
                    base: (0, path_1.PathToRelative)(path.base, this.origin_),
                    query: (0, path_1.TidyPath)(path.query),
                };
            }
        }
        else { //Url provided
            resolvedPath = (0, path_1.SplitPath)(path, this.origin_, this.prefix_);
        }
        if (resolvedPath) { //Valid path
            this.Load_(resolvedPath, true, shouldReload, data);
        }
    }
    Reload() {
        this.Goto(this.current_.path, true);
    }
    GetCurrentPath() {
        return this.current_.path;
    }
    GetActivePage() {
        return this.current_.page;
    }
    GetActivePageData(key) {
        if (key) {
            return (((0, is_object_1.IsObject)(this.current_.data) && this.current_.data.hasOwnProperty(key)) ? this.current_.data[key] : null);
        }
        return this.current_.data;
    }
    FindProtocolHandler_(protocol) {
        let info = this.protocolHandlers_.find(info => ((typeof info.protocol === 'string') ? (info.protocol === protocol) : info.protocol.test(protocol)));
        return (info ? info.handler : null);
    }
    Load_(path, pushHistory, shouldReload, data) {
        let protocolMatch = path.base.match(/^([a-zA-Z0-9_]+):\/\//), protocolHandler = (protocolMatch ? this.FindProtocolHandler_(protocolMatch[1]) : null);
        if (protocolHandler) { //Truncate protocol
            path.base = path.base.substring(protocolMatch[1].length + 2);
        }
        let joined = (0, path_1.JoinPath)(path), protocolHandlerResponse = (protocolHandler ? protocolHandler({ protocol: protocolMatch[1], path: joined }) : null);
        if (protocolHandlerResponse === true) {
            return; //Protocol handled
        }
        let page = null;
        if (!protocolHandlerResponse) {
            let samePath = (this.current_.path === joined);
            if (samePath && !shouldReload) {
                return;
            }
            page = this.FindMatchingPage(path.base);
            if (!page) { //Not found
                return window.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.404`, { detail: { path: (0, path_1.JoinPath)(path) } }));
            }
            if (data) {
                this.current_.initialData = (0, deep_copy_1.DeepCopy)(data);
                this.current_.data = data;
            }
            else if (samePath) { //Use initial if any
                this.current_.data = ((0, deep_copy_1.DeepCopy)(this.current_.initialData) || data);
            }
            else { //Reset
                this.current_.initialData = this.current_.data = null;
            }
        }
        this.SetActiveState_(true);
        window.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.entered`, { detail: { page: Object.assign({}, page) } }));
        let doLoad = () => this.DoLoad_(checkpoint, page, path, joined, pushHistory, ((typeof protocolHandlerResponse === 'function') ? protocolHandlerResponse : undefined));
        let checkpoint = (protocolHandlerResponse ? this.checkpoint_ : ++this.checkpoint_), checkMiddlewares = () => __awaiter(this, void 0, void 0, function* () {
            for (let middleware of ((typeof page.middleware === 'string') ? [page.middleware] : page.middleware)) {
                if (checkpoint != this.checkpoint_ || (this.middlewares_.hasOwnProperty(middleware) && !(yield this.middlewares_[middleware].Handle(joined)))) {
                    if (checkpoint == this.checkpoint_) { //Blocked
                        this.SetActiveState_(false);
                    }
                    return; //Invalid checkpoint OR blocked by middleware
                }
            }
            doLoad();
        });
        if (!protocolHandlerResponse && page.middleware) {
            checkMiddlewares();
        }
        else { //No middlewares to check
            doLoad();
        }
    }
    DoLoad_(checkpoint, page, path, joined, pushHistory, dataHandler) {
        var _a, _b;
        if (checkpoint != this.checkpoint_) {
            return;
        }
        if (!dataHandler) {
            if (page.id !== ((_a = this.current_.page) === null || _a === void 0 ? void 0 : _a.id)) { //New page
                document.title = (page.title || 'Untitled');
                this.current_.page = page;
                this.current_.path = joined;
                window.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.page`, { detail: { page: Object.assign({}, page) } }));
                window.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.path`, { detail: { path: Object.assign({}, path) } }));
            }
            else if (this.current_.path !== joined) {
                this.current_.path = joined;
                window.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.path`, { detail: { path: Object.assign({}, path) } }));
            }
            if (pushHistory) {
                window.history.pushState(path, (page.title || 'Untitled'), joined);
            }
        }
        let fetcher = this.fetchers_.find((fetcher) => {
            let path = fetcher.GetPath();
            return ((typeof path === 'string') ? (path === joined) : path.test(joined));
        });
        let handleData = (data) => {
            if (checkpoint == this.checkpoint_) {
                if (!dataHandler) {
                    window.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.data`, { detail: { data, path } }));
                    window.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.load`));
                }
                else { //Pass to handler
                    dataHandler(data);
                }
            }
            this.SetActiveState_(false);
        };
        let handleError = (err) => {
            window.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.error`, { detail: { path } }));
            this.SetActiveState_(false);
            (0, error_1.JournalError)(err, 'InlineJS.RouterConcept.Fetch');
        };
        if (!fetcher) { //Network fetch
            let reolvedPath = (this.prefix_ ? (0, path_1.PathToRelative)(joined, this.origin_, this.prefix_) : joined);
            if (dataHandler || !page.cache || !(0, get_1.GetGlobal)().GetConcept(names_1.ResourceConceptName)) {
                (0, get_1.GetGlobal)().GetFetchConcept().Get(reolvedPath, {
                    method: 'GET',
                    credentials: 'same-origin',
                }).then(res => res.text()).then(handleData).catch(handleError);
            }
            else { //Use resource
                (_b = (0, get_1.GetGlobal)().GetConcept(names_1.ResourceConceptName)) === null || _b === void 0 ? void 0 : _b.GetData(reolvedPath, true, false).then(handleData).catch(handleError);
            }
        }
        else { //Localized fetch
            fetcher.Handle(joined).then(handleData).catch(handleError);
        }
    }
    SetActiveState_(state) {
        if (state != this.active_) {
            this.active_ = state;
            window.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.active`, { detail: { state } }));
        }
    }
}
exports.RouterConcept = RouterConcept;
