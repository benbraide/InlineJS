"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnDirectiveHandlerCompact = exports.OnDirectiveExpansionRule = exports.OnDirectiveHandler = void 0;
const event_1 = require("../../../component/event");
const find_1 = require("../../../component/find");
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
const get_1 = require("../../../global/get");
const camel_case_1 = require("../../../utilities/camel-case");
const options_1 = require("../../options");
const keyEvents = ['keydown', 'keyup'], mobileMap = {
    click: 'touchend',
    mouseup: 'touchend',
    mousedown: 'touchstart',
    mousemove: 'touchmove',
};
function GetOptions(argKey, argOptions) {
    let options = {
        outside: false,
        prevent: false,
        stop: false,
        immediate: false,
        once: false,
        document: false,
        window: false,
        self: false,
        nexttick: false,
        mobile: false,
        join: false,
        camel: false,
        debounce: -1,
    };
    let keyOptions = (keyEvents.includes(argKey) ? {
        meta: false,
        alt: false,
        ctrl: false,
        shift: false,
        list: new Array(),
    } : null);
    (0, options_1.ResolveOptions)({
        options: [options, keyOptions],
        list: argOptions,
        defaultNumber: 250,
        unknownCallback: ({ option }) => {
            if (keyOptions && option) {
                let parts = ((option.length > 1) ? option.split('-') : []);
                if (parts.length == 2 && parts[0].length == 1 && parts[1].length == 1) { //E.g. A-Z
                    let fromCode = parts[0].charCodeAt(0), toCode = parts[1].charCodeAt(0);
                    keyOptions.list.push(Array.from({ length: (toCode - fromCode) }).map((i, index) => String.fromCharCode(index + fromCode)));
                }
                else {
                    keyOptions.list.push((0, get_1.GetGlobal)().GetConfig().MapKeyEvent((0, camel_case_1.ToCamelCase)(option).toLowerCase()));
                }
            }
        },
    });
    return { keyOptions, options };
}
exports.OnDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('on', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b, _c;
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression }), { keyOptions, options } = GetOptions(argKey, argOptions), debounced = false;
    let activeKeyOptions = Object.entries(keyOptions || {}).filter(([key, value]) => (value === true)).map(([key]) => key), onEvent = (e) => {
        var _a;
        if (debounced || (options.self && !options.outside && e.target !== contextElement) || activeKeyOptions.findIndex(opt => !e[`${opt}Key`]) != -1) {
            return; //Event is debounced OR event target is not context element OR specified key option is not pressed
        }
        if (keyOptions && keyOptions.list.length > 0) {
            let key = e.key.toLowerCase();
            if (keyOptions.list.findIndex(item => (Array.isArray(item) ? item.includes(key) : (item === key))) == -1) {
                return; //Key pressed doesn't match any specified
            }
        }
        if (options.debounce >= 0) { //Debounce for specified duration
            debounced = true;
            setTimeout(() => (debounced = false), (options.debounce || 250));
        }
        if (!options.outside) {
            options.prevent && e.preventDefault();
            options.once && target.removeEventListener(e.type, onEvent);
            options.stop && e.stopPropagation();
            options.stop && options.immediate && e.stopPropagation();
        }
        else if (options.once) {
            (0, event_1.RemoveOutsideEventListener)(contextElement, e.type, onEvent);
        }
        if (options.nexttick) {
            (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => doEvaluation(e));
        }
        else { //Immediate
            doEvaluation(e);
        }
    };
    let target = (options.window ? window : (options.document ? globalThis.document : contextElement)), doEvaluation = (e) => evaluate(undefined, [e], {
        event: e,
    });
    if (options.join) {
        argKey = argKey.split('-').join('.');
    }
    else if (options.camel) {
        argKey = (0, camel_case_1.ToCamelCase)(argKey);
    }
    let mappedEvent = ((options.mobile && argKey in mobileMap) ? mobileMap[argKey] : null);
    if (options.outside && target === contextElement) {
        (0, event_1.AddOutsideEventListener)(contextElement, argKey, onEvent);
        if (mappedEvent) {
            (0, event_1.AddOutsideEventListener)(contextElement, mappedEvent, onEvent);
        }
        let elementScope = (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetDirectiveManager().AddHandler(({ expression }) => (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression })((data) => {
            let map = {
                [argKey]: data,
            };
            mappedEvent && (map[mappedEvent] = data);
            (0, event_1.AddOutsideEventExcept)(contextElement, map, onEvent);
        }), 'outside.event.except');
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetDirectiveManager().AddHandler(({ expression }) => (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression })((data) => {
            (0, event_1.AddOutsideEventExcept)(contextElement, data, onEvent);
        }), 'outside.event.except.map');
    }
    else { //Bind on target
        target.addEventListener(argKey, onEvent);
        if (mappedEvent) {
            target.addEventListener(mappedEvent, onEvent);
        }
        if (target !== contextElement) { //Unbind on destruction
            (_c = (_b = (component || (0, find_1.FindComponentById)(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.AddUninitCallback(() => {
                target.removeEventListener(argKey, onEvent);
                if (mappedEvent) {
                    target.removeEventListener(mappedEvent, onEvent);
                }
            });
        }
    }
});
function OnDirectiveExpansionRule(name) {
    return (name.startsWith('@') ? name.replace('@', (0, get_1.GetGlobal)().GetConfig().GetDirectiveName('on:')) : null);
}
exports.OnDirectiveExpansionRule = OnDirectiveExpansionRule;
function OnDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.OnDirectiveHandler);
    (0, get_1.GetGlobal)().GetDirectiveManager().AddExpansionRule(OnDirectiveExpansionRule);
}
exports.OnDirectiveHandlerCompact = OnDirectiveHandlerCompact;
