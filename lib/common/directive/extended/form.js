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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveFormMiddleware = exports.AddFormMiddleware = exports.FormDirectiveHandlerCompact = exports.FormDirectiveHandler = void 0;
const find_1 = require("../../component/find");
const names_1 = require("../../concepts/names");
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
const evaluate_later_1 = require("../../evaluator/evaluate-later");
const get_1 = require("../../global/get");
const error_1 = require("../../journal/error");
const try_1 = require("../../journal/try");
const add_changes_1 = require("../../proxy/add-changes");
const create_1 = require("../../proxy/create");
const effect_1 = require("../../reactive/effect");
const is_object_1 = require("../../utilities/is-object");
const to_string_1 = require("../../utilities/to-string");
const event_1 = require("../event");
const options_1 = require("../options");
const FormDirectiveName = 'form';
let FormMiddlewares = {};
const FormMethodVerbs = ['put', 'patch', 'delete'];
const FormTokenName = '_FormPostToken_';
exports.FormDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)(FormDirectiveName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a;
    if ((0, event_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: FormDirectiveName,
        event: argKey,
        defaultEvent: 'success',
        eventWhitelist: ['error', 'submitting', 'submit', 'save', 'load', 'reset'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })) {
        return;
    }
    let resolvedComponent = (component || (0, find_1.FindComponentById)(componentId));
    if (!resolvedComponent) {
        return (0, error_1.JournalError)('Failed to resolve component.', 'InlineJS.FormDirectiveHandler', contextElement);
    }
    let localKey = `\$${FormDirectiveName}`;
    if (argKey === 'field') {
        return (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression })((value) => {
            var _a;
            if ((0, is_object_1.IsObject)(value)) {
                let proxy = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementLocalValue(contextElement, localKey, true);
                if (proxy && !(0, get_1.GetGlobal)().IsNothing(proxy)) {
                    Object.entries(value).forEach(([key, value]) => proxy.addField(key, value));
                }
            }
        });
    }
    if (argKey in FormMiddlewares) { //Bind data
        let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression });
        (0, effect_1.UseEffect)({ componentId, contextElement,
            callback: () => evaluate((data) => {
                var _a;
                let component = (0, find_1.FindComponentById)(componentId), proxy = component === null || component === void 0 ? void 0 : component.FindElementLocalValue(contextElement, localKey, true);
                if (proxy) { //Bind data
                    proxy.bindMiddlewareData(argKey, data, contextElement);
                    (_a = component.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.AddUninitCallback(() => {
                        var _a;
                        let proxy = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementLocalValue(contextElement, localKey, true);
                        if (proxy) {
                            proxy.unbindMiddlewareData(contextElement);
                        }
                    });
                }
            }),
        });
        return;
    }
    let id = resolvedComponent.GenerateUniqueId('form_proxy_'), middlewares = new Array(), options = (0, options_1.ResolveOptions)({
        options: {
            refresh: false,
            reload: false,
            persistent: false,
            reset: false,
            success: false,
            error: false,
            nexttick: false,
            novalidate: false,
            silent: false,
        },
        list: argOptions,
        unknownCallback: ({ option }) => {
            if (FormMiddlewares.hasOwnProperty(option = option.split('-').join('.'))) {
                middlewares.push(FormMiddlewares[option]);
            }
        },
    });
    let form = null, getAction, getMethod, appendFields = (url, fields) => {
        let query = fields.reduce((prev, [key, value]) => (prev ? `${prev}&${key}=${value}` : `${key}=${value}`), '');
        return (query ? (url.includes('?') ? `${url}&${query}` : `${url}?${query}`) : url);
    };
    let computeMethod = () => {
        let method = getMethod();
        if (FormMethodVerbs.includes(method)) {
            fields['_method'] = method;
            method = 'post';
        }
        return method;
    };
    let buildUrl, eventName, eventHandler = null, fields = {};
    if (contextElement instanceof HTMLFormElement) {
        getAction = () => contextElement.action;
        getMethod = () => (contextElement.method || 'get').toLowerCase();
        form = contextElement;
        eventName = 'submit';
        let method = getMethod();
        if (method !== 'get' && method !== 'head') {
            buildUrl = (info) => {
                info.body = new FormData(contextElement);
                return getAction();
            };
        }
        else { //Get | Head
            buildUrl = () => appendFields(getAction(), Array.from((new FormData(contextElement)).entries()).map(([key, value]) => [key, value.toString()]));
        }
    }
    else if (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement || contextElement instanceof HTMLSelectElement) {
        getAction = () => (contextElement.getAttribute('data-action') || '');
        getMethod = () => (contextElement.getAttribute('data-method') || 'get').toLowerCase();
        if (!(contextElement instanceof HTMLSelectElement)) {
            eventName = 'keydown';
            eventHandler = e => (!e || e.key.toLowerCase() === 'enter');
        }
        else { //Select
            eventName = 'change';
        }
        buildUrl = () => (fields[contextElement.getAttribute('name') || 'value'] = contextElement.value);
    }
    else { //Unknown
        let isAnchor = (contextElement instanceof HTMLAnchorElement);
        getAction = () => (isAnchor ? contextElement.href : (contextElement.getAttribute('data-action') || ''));
        getMethod = () => (contextElement.getAttribute('data-method') || 'get').toLowerCase();
        eventName = 'click';
        buildUrl = getAction;
    }
    let middlewareData = {}, state = {
        active: false,
        submitted: false,
        errors: {},
    };
    let updateState = (key, value) => {
        var _a;
        if (state[key] !== value) {
            state[key] = value;
            (0, add_changes_1.AddChanges)('set', `${id}.${key}`, key, (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
        }
    };
    let resolveMiddlewareData = (key) => (middlewareData.hasOwnProperty(key) ? middlewareData[key].data : undefined);
    let runMiddlewares = (callback) => __awaiter(void 0, void 0, void 0, function* () {
        for (let middleware of middlewares) {
            try {
                if ((yield middleware.Handle(resolveMiddlewareData(middleware.GetKey()), componentId, contextElement)) === false) {
                    return; //Rejected
                }
            }
            catch (_b) { }
        }
        if (callback) {
            callback();
        }
    });
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression }), doEvaluation = (ok, data) => {
        evaluate(undefined, undefined, {
            response: { ok, data },
        });
    };
    let afterHandledEvent = (ok, data) => {
        var _a;
        if (ok) {
            contextElement.dispatchEvent(new CustomEvent(`${FormDirectiveName}.success`, {
                detail: { data },
            }));
        }
        else {
            contextElement.dispatchEvent(new CustomEvent(`${FormDirectiveName}.error`, {
                detail: { data },
            }));
        }
        if ((!options.success && !options.error) || (options.success && ok) || (options.error && !ok)) {
            if (options.nexttick) {
                (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => doEvaluation(ok, data));
            }
            else {
                doEvaluation(ok, data);
            }
        }
    };
    let handleEvent = (e) => {
        if (state.active || (eventHandler && !eventHandler(e))) {
            return;
        }
        let event = new CustomEvent(`${FormDirectiveName}.submitting`);
        contextElement.dispatchEvent(event);
        if (event.defaultPrevented) {
            return;
        }
        let info = {
            method: computeMethod(),
            credentials: 'same-origin',
        };
        updateState('active', true);
        updateState('submitted', true);
        let url = buildUrl(info);
        if (info.method === 'post') { //Append applicable fields
            (info.body = (info.body || new FormData));
            if (FormTokenName in globalThis) {
                info.body.append('_token', globalThis[FormTokenName]);
            }
            Object.entries(fields).forEach(([key, value]) => info.body.append(key, value));
        }
        else { //Get | Head
            appendFields(url, Object.entries(fields));
        }
        (0, get_1.GetGlobal)().GetFetchConcept().Get(url, info).then(res => res.json()).then((response) => {
            updateState('active', false);
            updateState('errors', {});
            contextElement.dispatchEvent(new CustomEvent(`${FormDirectiveName}.submit`, {
                detail: { response: response },
            }));
            if (!response || !(0, is_object_1.IsObject)(response)) {
                return afterHandledEvent(true, response);
            }
            (0, try_1.JournalTry)(() => {
                var _a, _b;
                if (response.hasOwnProperty('failed')) {
                    let failed = response['failed'];
                    Object.entries((0, is_object_1.IsObject)(failed) ? failed : {}).forEach(([key, value]) => {
                        state.errors[key] = value;
                        if (form && !options.novalidate) { //Set validation error
                            let item = form.elements.namedItem(key);
                            if (item && (item instanceof HTMLInputElement || item instanceof HTMLTextAreaElement || item instanceof HTMLSelectElement)) {
                                item.setCustomValidity(Array.isArray(value) ? value.map(v => (0, to_string_1.ToString)(v)).join('\n') : (0, to_string_1.ToString)(value));
                                item.dispatchEvent(new CustomEvent(`${FormDirectiveName}.validity`));
                            }
                        }
                    });
                }
                if (!options.silent && (response.hasOwnProperty('alert') || response.hasOwnProperty('report'))) {
                    (_a = (0, get_1.GetGlobal)().GetConcept('alert')) === null || _a === void 0 ? void 0 : _a.Notify(response['alert'] || response['report']);
                }
                afterHandledEvent((response['ok'] !== false), response['data']);
                if (response['ok'] === false) {
                    return;
                }
                let router = (0, get_1.GetGlobal)().GetConcept(names_1.RouterConceptName), after = null;
                if (response.hasOwnProperty('redirect')) {
                    let redirect = response['redirect'];
                    if ((0, is_object_1.IsObject)(redirect)) {
                        after = () => {
                            if (!options.refresh && !redirect['refresh'] && router) {
                                router.Goto(redirect['page'], (options.reload || redirect['reload']), (response.hasOwnProperty('data') ? redirect['data'] : undefined));
                            }
                            else {
                                window.location.href = redirect['page'];
                            }
                        };
                    }
                    else if (typeof redirect === 'string') {
                        after = () => {
                            if (!options.refresh && router) {
                                router.Goto(redirect, options.reload);
                            }
                            else {
                                window.location.href = redirect;
                            }
                        };
                    }
                }
                else if (options.refresh) {
                    after = () => window.location.reload();
                }
                else if (options.reload) {
                    after = () => (router ? router.Reload() : window.location.reload());
                }
                else if (options.reset && form) {
                    form.reset();
                    (_b = (0, find_1.FindComponentById)(componentId)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes.AddNextTickHandler(() => form === null || form === void 0 ? void 0 : form.dispatchEvent(new CustomEvent(`${FormDirectiveName}.reset`)));
                }
                if (after) {
                    after();
                }
            }, `InlineJS.${FormDirectiveName}.HandleEvent`, contextElement);
        }).catch((err) => {
            updateState('active', false);
            (0, error_1.JournalError)(err, `InlineJS.${FormDirectiveName}.HandleEvent`, contextElement);
        });
    };
    (_a = resolvedComponent.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.SetLocal(localKey, (0, create_1.CreateInplaceProxy)((0, create_1.BuildGetterProxyOptions)({
        getter: (prop) => {
            var _a;
            if (prop && state.hasOwnProperty(prop)) {
                (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return state[prop];
            }
            if (prop === 'element') {
                return contextElement;
            }
            if (prop === 'submit') {
                return (shouldRunMiddlewares = true) => {
                    if (shouldRunMiddlewares) {
                        runMiddlewares(handleEvent);
                    }
                    else { //Skip middlewares
                        handleEvent();
                    }
                };
            }
            if (prop === 'reset') {
                return () => form === null || form === void 0 ? void 0 : form.reset();
            }
            if (prop === 'bindMiddlewareData') {
                return (middleware, data, source) => {
                    middlewareData[middleware] = { data, source };
                };
            }
            if (prop === 'unbindMiddlewareData') {
                return (target) => {
                    if (typeof target !== 'string') {
                        Object.entries(middlewareData).forEach(([key, value]) => {
                            if (value.source === target) {
                                delete middlewareData[key];
                            }
                        });
                    }
                    else { //Unbind single
                        delete middlewareData[target];
                    }
                };
            }
            if (prop === 'addField') {
                return (name, value) => (fields[name] = value);
            }
            if (prop === 'removeField') {
                return (name) => (delete fields[name]);
            }
        },
        lookup: [...Object.keys(state), 'element', 'submit', 'reset', 'bindMiddlewareData', 'unbindMiddlewareData', 'addField', 'removeField'],
    })));
    let onEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!state.active) {
            runMiddlewares(handleEvent);
        }
    };
    contextElement.addEventListener(eventName, onEvent);
});
function FormDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.FormDirectiveHandler);
}
exports.FormDirectiveHandlerCompact = FormDirectiveHandlerCompact;
function AddFormMiddleware(middleware) {
    FormMiddlewares[middleware.GetKey()] = middleware;
}
exports.AddFormMiddleware = AddFormMiddleware;
function RemoveFormMiddleware(name) {
    if (FormMiddlewares.hasOwnProperty(name)) {
        delete FormMiddlewares[name];
    }
}
exports.RemoveFormMiddleware = RemoveFormMiddleware;
