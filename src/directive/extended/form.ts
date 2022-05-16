import { FindComponentById } from "../../component/find";
import { RouterConceptName } from "../../concepts/names";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { GetGlobal } from "../../global/get";
import { JournalError } from "../../journal/error";
import { JournalTry } from "../../journal/try";
import { AddChanges } from "../../proxy/add-changes";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { UseEffect } from "../../reactive/effect";
import { IAlertConcept } from "../../types/alert";
import { IComponent } from "../../types/component";
import { IRouterConcept } from "../../types/router";
import { IsObject } from "../../utilities/is-object";
import { ToString } from "../../utilities/to-string";
import { BindEvent } from "../event";
import { ResolveOptions } from "../options";

const FormDirectiveName = 'form';

interface IFormMiddlewareDataInfo{
    data: any;
    source?: HTMLElement;
}

export interface IFormMiddleware{
    GetKey(): string;
    Handle(data?: any, component?: IComponent | string, contextElement?: HTMLElement): Promise<void | boolean>;
}

let FormMiddlewares: Record<string, IFormMiddleware> = {};

const FormMethodVerbs = ['put', 'patch', 'delete'];
const FormTokenName = '_FormPostToken_';

export const FormDirectiveHandler = CreateDirectiveHandlerCallback(FormDirectiveName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: FormDirectiveName,
        event: argKey,
        defaultEvent: 'success',
        eventWhitelist: ['error', 'submitting', 'submit', 'save', 'load', 'reset'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })){
        return;
    }

    let resolvedComponent = (component || FindComponentById(componentId));
    if (!resolvedComponent){
        return JournalError('Failed to resolve component.', 'InlineJS.FormDirectiveHandler', contextElement);
    }

    let localKey = `\$${FormDirectiveName}`;
    if (argKey === 'field'){
        return EvaluateLater({ componentId, contextElement, expression })((value) => {
            if (IsObject(value)){
                let proxy = FindComponentById(componentId)?.FindElementLocalValue(contextElement, localKey, true);
                if (proxy && !GetGlobal().IsNothing(proxy)){
                    Object.entries(value).forEach(([key, value]) => proxy.addField(key, value));
                }
            }
        });
    }
    
    if (argKey in FormMiddlewares){//Bind data
        let evaluate = EvaluateLater({ componentId, contextElement, expression });
        UseEffect({ componentId, contextElement,
            callback: () => evaluate((data) => {
                let component = FindComponentById(componentId), proxy = component?.FindElementLocalValue(contextElement, localKey, true);
                if (proxy){//Bind data
                    proxy.bindMiddlewareData(argKey, data, contextElement);
                    component!.FindElementScope(contextElement)?.AddUninitCallback(() => {
                        let proxy = FindComponentById(componentId)?.FindElementLocalValue(contextElement, localKey, true);
                        if (proxy){
                            proxy.unbindMiddlewareData(contextElement);
                        }
                    });
                }
            }),
        });
        
        return;
    }

    let id = resolvedComponent.GenerateUniqueId('form_proxy_'), middlewares = new Array<IFormMiddleware>(), options = ResolveOptions({
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
            if (FormMiddlewares.hasOwnProperty(option = option!.split('-').join('.'))){
                middlewares.push(FormMiddlewares[option]);
            }
        },
    });

    let form: HTMLFormElement | null = null, getAction: () => string, getMethod: () => string, appendFields = (url: string, fields: Array<[string, string]>) => {
        let query = fields.reduce((prev, [key, value]) => (prev ? `${prev}&${key}=${value}` : `${key}=${value}`), '');
        return (query ? (url.includes('?') ? `${url}&${query}` : `${url}?${query}`) : url);
    };

    let computeMethod = () => {
        let method = getMethod();
        if (FormMethodVerbs.includes(method)){
            fields['_method'] = method;
            method = 'post';
        }

        return method;
    };

    let buildUrl: (info: RequestInit) => string, eventName: string, eventHandler: ((e?: Event) => boolean) | null = null, fields: Record<string, string> = {};
    if (contextElement instanceof HTMLFormElement){
        getAction = () => contextElement.action;
        getMethod = () => (contextElement.method || 'get').toLowerCase();
        
        form = contextElement;
        eventName = 'submit';

        let method = getMethod();
        if (method !== 'get' && method !== 'head'){
            buildUrl = (info) => {
                info.body = new FormData(contextElement);
                return getAction();
            };
        }
        else{//Get | Head
            buildUrl = () => appendFields(getAction(), Array.from((new FormData(contextElement)).entries()).map(([key, value]) => [key, value.toString()]));
        }
    }
    else if (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement || contextElement instanceof HTMLSelectElement){
        getAction = () => (contextElement.getAttribute('data-action') || '');
        getMethod = () => (contextElement.getAttribute('data-method') || 'get').toLowerCase();

        if (!(contextElement instanceof HTMLSelectElement)){
            eventName = 'keydown';
            eventHandler = e => (!e || (e as KeyboardEvent).key.toLowerCase() === 'enter');
        }
        else{//Select
            eventName = 'change';
        }
        
        buildUrl = () => (fields[contextElement.getAttribute('name') || 'value'] = contextElement.value);
    }
    else{//Unknown
        let isAnchor = (contextElement instanceof HTMLAnchorElement);

        getAction = () => (isAnchor ? (contextElement as HTMLAnchorElement).href : (contextElement.getAttribute('data-action') || ''));
        getMethod = () => (contextElement.getAttribute('data-method') || 'get').toLowerCase();

        eventName = 'click';
        buildUrl = getAction;
    }

    let middlewareData: Record<string, IFormMiddlewareDataInfo> = {}, state = {
        active: false,
        submitted: false,
        errors: {},
    };

    let updateState = (key: string, value: any) => {
        if (state[key] !== value){
            state[key] = value;
            AddChanges('set', `${id}.${key}`, key, FindComponentById(componentId)?.GetBackend().changes);
        }
    };

    let resolveMiddlewareData = (key: string) => (middlewareData.hasOwnProperty(key) ? middlewareData[key].data : undefined);
    let runMiddlewares = async (callback: () => void) => {
        for (let middleware of middlewares){
            try{
                if (await middleware.Handle(resolveMiddlewareData(middleware.GetKey()), componentId, contextElement) === false){
                    return;//Rejected
                }
            }
            catch{}
        }

        if (callback){
            callback();
        }
    };

    let evaluate = EvaluateLater({ componentId, contextElement, expression }), doEvaluation = (ok: boolean, data: any) => {
        evaluate(undefined, undefined, {
            response: { ok, data },
        });
    };
    
    let afterHandledEvent = (ok: boolean, data: any) => {
        if (ok){
            contextElement.dispatchEvent(new CustomEvent(`${FormDirectiveName}.success`, {
                detail: { data },
            }));
        }
        else{
            contextElement.dispatchEvent(new CustomEvent(`${FormDirectiveName}.error`, {
                detail: { data },
            }));
        }

        if ((!options.success && !options.error) || (options.success && ok) || (options.error && !ok)){
            if (options.nexttick){
                FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => doEvaluation(ok, data));
            }
            else{
                doEvaluation(ok, data);
            }
        }
    };

    let handleEvent = (e?: Event) => {
        if (state.active || (eventHandler && !eventHandler(e))){
            return;
        }
        
        let event = new CustomEvent(`${FormDirectiveName}.submitting`);
        contextElement.dispatchEvent(event);
        if (event.defaultPrevented){
            return;
        }
        
        let info: RequestInit = {
            method: computeMethod(),
            credentials: 'same-origin',
        };

        updateState('active', true);
        updateState('submitted', true);

        let url = buildUrl(info);
        if (info.method === 'post'){//Append applicable fields
            (info.body = (info.body || new FormData));
            if (FormTokenName in globalThis){
                (info.body as FormData).append('_token', globalThis[FormTokenName]);
            }

            Object.entries(fields).forEach(([key, value]) => (info.body as FormData).append(key, value));
        }
        else{//Get | Head
            appendFields(url, Object.entries(fields));
        }

        GetGlobal().GetFetchConcept().Get(url, info).then(res => res.json()).then((response) => {
            updateState('active', false);
            updateState('errors', {});

            contextElement.dispatchEvent(new CustomEvent(`${FormDirectiveName}.submit`, {
                detail: { response: response },
            }));
            
            if (!response || !IsObject(response)){
                return afterHandledEvent(true, response);
            }

            JournalTry(() => {
                if (response.hasOwnProperty('failed')){
                    let failed = response['failed'];
                    Object.entries(IsObject(failed) ? failed : {}).forEach(([key, value]) => {
                        state.errors[key] = value;

                        if (form && !options.novalidate){//Set validation error
                            let item = form.elements.namedItem(key);
                            if (item && (item instanceof HTMLInputElement || item instanceof HTMLTextAreaElement || item instanceof HTMLSelectElement)){
                                item.setCustomValidity(Array.isArray(value) ? value.map(v => ToString(v)).join('\n') : ToString(value));
                                item.dispatchEvent(new CustomEvent(`${FormDirectiveName}.validity`));
                            }
                        }
                    });
                }

                if (!options.silent && (response.hasOwnProperty('alert') || response.hasOwnProperty('report'))){
                    GetGlobal().GetConcept<IAlertConcept>('alert')?.Notify(response['alert'] || response['report']);
                }

                afterHandledEvent((response['ok'] !== false), response['data']);
                if (response['ok'] === false){
                    return;
                }

                let router = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName), after: (() => void) | null = null;
                if (response.hasOwnProperty('redirect')){
                    let redirect = response['redirect'];
                    if (IsObject(redirect)){
                        after = () => {
                            if (!options.refresh && !redirect['refresh'] && router){
                                router.Goto(redirect['page'], (options.reload || redirect['reload']), (response.hasOwnProperty('data') ? redirect['data'] : undefined));
                            }
                            else{
                                window.location.href = redirect['page'];
                            }
                        };
                    }
                    else if (typeof redirect === 'string'){
                        after = () => {
                            if (!options.refresh && router){
                                router.Goto(redirect, options.reload);
                            }
                            else{
                                window.location.href = redirect;
                            }
                        };
                    }
                }
                else if (options.refresh){
                    after = () => window.location.reload();
                }
                else if (options.reload){
                    after = () => (router ? router.Reload() : window.location.reload());
                }
                else if (options.reset && form){
                    form.reset();
                    FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => form?.dispatchEvent(new CustomEvent(`${FormDirectiveName}.reset`)));
                }

                if (after){
                    after();
                }
            }, `InlineJS.${FormDirectiveName}.HandleEvent`, contextElement);
        }).catch((err) => {
            updateState('active', false);
            JournalError(err, `InlineJS.${FormDirectiveName}.HandleEvent`, contextElement);
        });
    };

    resolvedComponent.FindElementScope(contextElement)?.SetLocal(localKey, CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && state.hasOwnProperty(prop)){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return state[prop];
            }

            if (prop === 'element'){
                return contextElement;
            }
    
            if (prop === 'submit'){
                return (shouldRunMiddlewares = true) => {
                    if (shouldRunMiddlewares){
                        runMiddlewares(handleEvent);
                    }
                    else{//Skip middlewares
                        handleEvent();
                    }
                };
            }

            if (prop === 'reset'){
                return () => form?.reset();
            }
    
            if (prop === 'bindMiddlewareData'){
                return (middleware: string, data: any, source?: HTMLElement) => {
                    middlewareData[middleware] = { data, source };
                };
            }
    
            if (prop === 'unbindMiddlewareData'){
                return (target: string | HTMLElement) => {
                    if (typeof target !== 'string'){
                        Object.entries(middlewareData).forEach(([key, value]) => {
                            if (value.source === target){
                                delete middlewareData[key];
                            }
                        });
                    }
                    else{//Unbind single
                        delete middlewareData[target];
                    }
                };
            }

            if (prop === 'addField'){
                return (name: string, value: string) => (fields[name] = value);
            }

            if (prop === 'removeField'){
                return (name: string) => (delete fields[name]);
            }
        },
        lookup: [...Object.keys(state), 'element', 'submit', 'reset', 'bindMiddlewareData', 'unbindMiddlewareData', 'addField', 'removeField'],
    })));

    let onEvent = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        if (!state.active){
            runMiddlewares(handleEvent);
        }
    };

    contextElement.addEventListener(eventName, onEvent);
});

export function FormDirectiveHandlerCompact(){
    AddDirectiveHandler(FormDirectiveHandler);
}

export function AddFormMiddleware(middleware: IFormMiddleware){
    FormMiddlewares[middleware.GetKey()] = middleware;
}

export function RemoveFormMiddleware(name: string){
    if (FormMiddlewares.hasOwnProperty(name)){
        delete FormMiddlewares[name];
    }
}
