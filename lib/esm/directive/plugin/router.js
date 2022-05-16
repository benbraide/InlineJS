import { BootstrapAndAttach } from "../../bootstrap/attach";
import { FindComponentById } from "../../component/find";
import { InsertHtml } from "../../component/insert-html";
import { RouterFetcher } from "../../concepts/fetcher";
import { DefaultRouterEvent, RouterConceptName, RouterEvents } from "../../concepts/names";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { GetGlobal } from "../../global/get";
import { JournalError } from "../../journal/error";
import { BindEvent, ForwardEvent } from "../event";
import { ResolveOptions } from "../options";
export const RouterDirectiveHandler = CreateDirectiveHandlerCallback(RouterConceptName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: RouterConceptName,
        event: argKey,
        defaultEvent: DefaultRouterEvent,
        eventWhitelist: RouterEvents,
        options: [...argOptions, 'window'],
        optionBlacklist: ['document', 'outside'],
    })) {
        return;
    }
    if (argKey === 'fetch') {
        if (!(contextElement instanceof HTMLTemplateElement)) {
            return JournalError('Target is not a template element.', `${RouterConceptName}:${argKey}`, contextElement);
        }
        EvaluateLater({ componentId, contextElement, expression })((value) => {
            var _a, _b;
            if (value && (typeof value === 'string' || value instanceof RegExp)) {
                let concept = GetGlobal().GetConcept(RouterConceptName);
                if (concept) {
                    let fetcher = new RouterFetcher(value, () => Promise.resolve(contextElement.innerHTML));
                    concept.AddFetcher(fetcher);
                    (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => concept === null || concept === void 0 ? void 0 : concept.RemoveFetcher(fetcher));
                }
            }
            else {
                JournalError('Target path is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
            }
        });
    }
    else if (argKey === 'mount') {
        let concept = GetGlobal().GetConcept(RouterConceptName);
        if (!concept) {
            return JournalError(`${RouterConceptName} concept is not installed.`, `${RouterConceptName}:${argKey}`, contextElement);
        }
        if (!contextElement.parentElement) {
            return JournalError('Target must have a parent element.', `${RouterConceptName}:${argKey}`, contextElement);
        }
        EvaluateLater({ componentId, contextElement, expression })((value) => {
            var _a, _b;
            let options = ResolveOptions({ options: { protocol: false, scroll: false }, list: argOptions });
            if (options.protocol && (!value || (typeof value !== 'string' && !(value instanceof RegExp)))) {
                return JournalError('Target protocol is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
            }
            let getMount = (el) => {
                var _a;
                if (!(contextElement instanceof HTMLTemplateElement)) {
                    return contextElement;
                }
                if (!el || typeof el === 'string') {
                    try {
                        mountElement = document.createElement(el || 'div');
                        return (mountElement || document.createElement('div'));
                    }
                    catch (_b) { }
                    return document.createElement('div');
                }
                if (el instanceof HTMLElement) {
                    let root = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetRoot();
                    return ((root === el || (root === null || root === void 0 ? void 0 : root.contains(el))) ? el : null);
                }
                return null;
            };
            let mountElement = getMount(options.protocol ? null : value);
            if (!mountElement) {
                return JournalError('Mount target is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
            }
            let onUninit = null;
            if (!mountElement.parentElement) { //Add to DOM
                contextElement.parentElement.insertBefore(mountElement, contextElement);
                onUninit = () => mountElement.remove();
            }
            let handleData = (data) => {
                if (options.scroll) {
                    window.scrollTo({ top: 0, left: 0 });
                }
                Array.from(mountElement.attributes).forEach(attr => mountElement.removeAttribute(attr.name));
                InsertHtml({
                    element: mountElement,
                    html: data,
                    component: componentId,
                    processDirectives: false,
                });
                BootstrapAndAttach(mountElement);
            };
            let savedPath = null, checkpoint = 0, event = `${RouterConceptName}.data`, onEvent = (e) => handleData(e.detail.data);
            let protocolHandler = ({ path }) => {
                contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.entered`));
                if (path === savedPath) { //Skip
                    contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.reload`));
                    return true;
                }
                savedPath = path;
                let myCheckpoint = ++checkpoint;
                return (data) => {
                    if (myCheckpoint == checkpoint) {
                        handleData(data);
                        contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.load`));
                    }
                };
            };
            if (options.protocol) {
                concept.AddProtocolHandler(value, protocolHandler);
            }
            else {
                window.addEventListener(event, onEvent);
            }
            (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => {
                if (options.protocol) {
                    concept === null || concept === void 0 ? void 0 : concept.RemoveProtocolHandler(protocolHandler);
                }
                else {
                    window.removeEventListener(event, onEvent);
                }
                onUninit && onUninit();
            });
        });
    }
    else if (argKey === 'mount-load' || argKey === 'mount-reload' || argKey === 'mount-entered') {
        ForwardEvent(componentId, contextElement, `${RouterConceptName}-${argKey}.join`, expression, argOptions);
    }
    else if (argKey === 'link') {
        if (!(contextElement instanceof HTMLAnchorElement) && !(contextElement instanceof HTMLFormElement)) {
            return JournalError('Target must be a anchor or form element.', `${RouterConceptName}:${argKey}`, contextElement);
        }
        let getPath, getEvent;
        if (contextElement instanceof HTMLFormElement) {
            if (contextElement.method.toLowerCase() !== 'get') {
                return JournalError('Form element must use the GET method.', `${RouterConceptName}:${argKey}`, contextElement);
            }
            getPath = () => {
                let path = contextElement.action, query = '';
                (new FormData(contextElement)).forEach((value, key) => {
                    query = (query ? `${query}&${key}=${value.toString()}` : `${key}=${value.toString()}`);
                });
                return (query ? (path.includes('?') ? `${path}&${query}` : `${path}?${query}`) : path);
            };
            getEvent = () => 'submit';
        }
        else { //Anchor
            getPath = () => contextElement.href;
            getEvent = () => 'click';
        }
        let options = ResolveOptions({ options: { reload: false }, list: argOptions }), onEvent = (e) => {
            var _a;
            e.preventDefault();
            e.stopPropagation();
            (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.Goto(getPath(), options.reload);
        };
        contextElement.addEventListener(getEvent(), onEvent);
    }
});
export function RouterDirectiveHandlerCompact() {
    AddDirectiveHandler(RouterDirectiveHandler);
}
