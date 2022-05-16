import { AddOutsideEventExcept, AddOutsideEventListener, RemoveOutsideEventListener } from "../../../component/event";
import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { GetGlobal } from "../../../global/get";
import { ToCamelCase } from "../../../utilities/camel-case";
import { ResolveOptions } from "../../options";
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
    ResolveOptions({
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
                    keyOptions.list.push(GetGlobal().GetConfig().MapKeyEvent(ToCamelCase(option).toLowerCase()));
                }
            }
        },
    });
    return { keyOptions, options };
}
export const OnDirectiveHandler = CreateDirectiveHandlerCallback('on', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b, _c;
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), { keyOptions, options } = GetOptions(argKey, argOptions), debounced = false;
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
            RemoveOutsideEventListener(contextElement, e.type, onEvent);
        }
        if (options.nexttick) {
            (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => doEvaluation(e));
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
        argKey = ToCamelCase(argKey);
    }
    let mappedEvent = ((options.mobile && argKey in mobileMap) ? mobileMap[argKey] : null);
    if (options.outside && target === contextElement) {
        AddOutsideEventListener(contextElement, argKey, onEvent);
        if (mappedEvent) {
            AddOutsideEventListener(contextElement, mappedEvent, onEvent);
        }
        let elementScope = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetDirectiveManager().AddHandler(({ expression }) => EvaluateLater({ componentId, contextElement, expression })((data) => {
            let map = {
                [argKey]: data,
            };
            mappedEvent && (map[mappedEvent] = data);
            AddOutsideEventExcept(contextElement, map, onEvent);
        }), 'outside.event.except');
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetDirectiveManager().AddHandler(({ expression }) => EvaluateLater({ componentId, contextElement, expression })((data) => {
            AddOutsideEventExcept(contextElement, data, onEvent);
        }), 'outside.event.except.map');
    }
    else { //Bind on target
        target.addEventListener(argKey, onEvent);
        if (mappedEvent) {
            target.addEventListener(mappedEvent, onEvent);
        }
        if (target !== contextElement) { //Unbind on destruction
            (_c = (_b = (component || FindComponentById(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.AddUninitCallback(() => {
                target.removeEventListener(argKey, onEvent);
                if (mappedEvent) {
                    target.removeEventListener(mappedEvent, onEvent);
                }
            });
        }
    }
});
export function OnDirectiveExpansionRule(name) {
    return (name.startsWith('@') ? name.replace('@', GetGlobal().GetConfig().GetDirectiveName('on:')) : null);
}
export function OnDirectiveHandlerCompact() {
    AddDirectiveHandler(OnDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(OnDirectiveExpansionRule);
}
