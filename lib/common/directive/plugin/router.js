"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterDirectiveHandlerCompact = exports.RouterDirectiveHandler = void 0;
const attach_1 = require("../../bootstrap/attach");
const find_1 = require("../../component/find");
const insert_html_1 = require("../../component/insert-html");
const fetcher_1 = require("../../concepts/fetcher");
const names_1 = require("../../concepts/names");
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
const evaluate_later_1 = require("../../evaluator/evaluate-later");
const get_1 = require("../../global/get");
const error_1 = require("../../journal/error");
const event_1 = require("../event");
const options_1 = require("../options");
exports.RouterDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)(names_1.RouterConceptName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if ((0, event_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: names_1.RouterConceptName,
        event: argKey,
        defaultEvent: names_1.DefaultRouterEvent,
        eventWhitelist: names_1.RouterEvents,
        options: [...argOptions, 'window'],
        optionBlacklist: ['document', 'outside'],
    })) {
        return;
    }
    if (argKey === 'fetch') {
        if (!(contextElement instanceof HTMLTemplateElement)) {
            return (0, error_1.JournalError)('Target is not a template element.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
        }
        (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression })((value) => {
            var _a, _b;
            if (value && (typeof value === 'string' || value instanceof RegExp)) {
                let concept = (0, get_1.GetGlobal)().GetConcept(names_1.RouterConceptName);
                if (concept) {
                    let fetcher = new fetcher_1.RouterFetcher(value, () => Promise.resolve(contextElement.innerHTML));
                    concept.AddFetcher(fetcher);
                    (_b = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => concept === null || concept === void 0 ? void 0 : concept.RemoveFetcher(fetcher));
                }
            }
            else {
                (0, error_1.JournalError)('Target path is invalid.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
            }
        });
    }
    else if (argKey === 'mount') {
        let concept = (0, get_1.GetGlobal)().GetConcept(names_1.RouterConceptName);
        if (!concept) {
            return (0, error_1.JournalError)(`${names_1.RouterConceptName} concept is not installed.`, `${names_1.RouterConceptName}:${argKey}`, contextElement);
        }
        if (!contextElement.parentElement) {
            return (0, error_1.JournalError)('Target must have a parent element.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
        }
        (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression })((value) => {
            var _a, _b;
            let options = (0, options_1.ResolveOptions)({ options: { protocol: false, scroll: false }, list: argOptions });
            if (options.protocol && (!value || (typeof value !== 'string' && !(value instanceof RegExp)))) {
                return (0, error_1.JournalError)('Target protocol is invalid.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
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
                    let root = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetRoot();
                    return ((root === el || (root === null || root === void 0 ? void 0 : root.contains(el))) ? el : null);
                }
                return null;
            };
            let mountElement = getMount(options.protocol ? null : value);
            if (!mountElement) {
                return (0, error_1.JournalError)('Mount target is invalid.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
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
                (0, insert_html_1.InsertHtml)({
                    element: mountElement,
                    html: data,
                    component: componentId,
                    processDirectives: false,
                });
                (0, attach_1.BootstrapAndAttach)(mountElement);
            };
            let savedPath = null, checkpoint = 0, event = `${names_1.RouterConceptName}.data`, onEvent = (e) => handleData(e.detail.data);
            let protocolHandler = ({ path }) => {
                contextElement.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.mount.entered`));
                if (path === savedPath) { //Skip
                    contextElement.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.mount.reload`));
                    return true;
                }
                savedPath = path;
                let myCheckpoint = ++checkpoint;
                return (data) => {
                    if (myCheckpoint == checkpoint) {
                        handleData(data);
                        contextElement.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.mount.load`));
                    }
                };
            };
            if (options.protocol) {
                concept.AddProtocolHandler(value, protocolHandler);
            }
            else {
                window.addEventListener(event, onEvent);
            }
            (_b = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => {
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
        (0, event_1.ForwardEvent)(componentId, contextElement, `${names_1.RouterConceptName}-${argKey}.join`, expression, argOptions);
    }
    else if (argKey === 'link') {
        if (!(contextElement instanceof HTMLAnchorElement) && !(contextElement instanceof HTMLFormElement)) {
            return (0, error_1.JournalError)('Target must be a anchor or form element.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
        }
        let getPath, getEvent;
        if (contextElement instanceof HTMLFormElement) {
            if (contextElement.method.toLowerCase() !== 'get') {
                return (0, error_1.JournalError)('Form element must use the GET method.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
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
        let options = (0, options_1.ResolveOptions)({ options: { reload: false }, list: argOptions }), onEvent = (e) => {
            var _a;
            e.preventDefault();
            e.stopPropagation();
            (_a = (0, get_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.Goto(getPath(), options.reload);
        };
        contextElement.addEventListener(getEvent(), onEvent);
    }
});
function RouterDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.RouterDirectiveHandler);
}
exports.RouterDirectiveHandlerCompact = RouterDirectiveHandlerCompact;
