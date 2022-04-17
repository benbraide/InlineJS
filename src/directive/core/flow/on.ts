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

function GetOptions(argKey: string, argOptions: Array<string>){
    let keyOptions = (keyEvents.includes(argKey) ? {
        meta: false,
        alt: false,
        ctrl: false,
        shift: false,
        list: new Array<string>(),
    } : null);

    let options = ResolveOptions({
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
    }, argOptions, 250, ({ option, options } = {}) => {
        if (keyOptions && option && option in keyOptions && typeof keyOptions[option] === 'boolean'){
            keyOptions[option] = true;
        }
        else if (keyOptions && option && !(option in options!)){
            keyOptions.list.push(GetGlobal().GetConfig().MapKeyEvent(ToCamelCase(option, true)));
        }
    });

    return { keyOptions, options };
}

export const OnDirectiveHandler = CreateDirectiveHandlerCallback('on', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), { keyOptions, options } = GetOptions(argKey, argOptions), debounced = false;
    let activeKeyOptions = Object.entries(keyOptions || {}).filter(([key, value]) => (value === true)).map(([key]) => key), onEvent = (e: Event) => {
        if (debounced || (options.self && !options.outside && e.target !== contextElement) || activeKeyOptions.findIndex(opt => !e[`${opt}Key`]) != -1){
            return;//Event is debounced OR event target is not context element OR specified key option is not pressed
        }

        if (keyOptions && keyOptions.list.length > 0 && !keyOptions.list.includes((e as KeyboardEvent).key)){
            return;//Key pressed doesn't match any specified
        }

        if (options.debounce >= 0){//Debounce for specified duration
            debounced = true;
            setTimeout(() => (debounced = false), (options.debounce || 250));
        }

        if (!options.outside){
            options.prevent && e.preventDefault();
            options.once && target.removeEventListener(e.type, onEvent);

            options.stop && e.stopPropagation();
            options.stop && options.immediate && e.stopPropagation();
        }
        else if (options.once){
            RemoveOutsideEventListener(contextElement, e.type, <any>onEvent);
        }

        if (options.nexttick){
            FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => doEvaluation(e));
        }
        else{//Immediate
            doEvaluation(e);
        }
    };

    let target = (options.window ? window : (options.document ? globalThis.document : contextElement)), doEvaluation = (e: Event) => evaluate(undefined, [e], {
        event: e,
    });

    if (options.join){
        argKey = argKey.split('-').join('.');
    }
    else if (options.camel){
        argKey = ToCamelCase(argKey);
    }

    let mappedEvent = ((options.mobile && argKey in mobileMap) ? <string>mobileMap[argKey] : null);
    if (options.outside && target === contextElement){
        AddOutsideEventListener(contextElement, argKey, <any>onEvent);
        if (mappedEvent){
            AddOutsideEventListener(contextElement, mappedEvent, <any>onEvent);
        }

        let elementScope = (component || FindComponentById(componentId))?.FindElementScope(contextElement);
        elementScope?.GetDirectiveManager().AddHandler(({ expression }) => EvaluateLater({ componentId, contextElement, expression })((data) => {
            let map = {
                [argKey]: data,
            };

            mappedEvent && (map[mappedEvent] = data);
            AddOutsideEventExcept(contextElement, map, <any>onEvent);
        }), 'outside.event.except');

        elementScope?.GetDirectiveManager().AddHandler(({ expression }) => EvaluateLater({ componentId, contextElement, expression })((data) => {
            AddOutsideEventExcept(contextElement, data, <any>onEvent);
        }), 'outside.event.except.map');
    }
    else{//Bind on target
        target.addEventListener(argKey, onEvent);
        if (mappedEvent){
            target.addEventListener(mappedEvent, onEvent);
        }

        if (target !== contextElement){//Unbind on destruction
            (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => {
                target.removeEventListener(argKey, onEvent);
                if (mappedEvent){
                    target.removeEventListener(mappedEvent, onEvent);
                }
            });
        }
    }
});

export function OnDirectiveExpansionRule(name: string){
    return (name.startsWith('@') ? name.replace('@', GetGlobal().GetConfig().GetDirectiveName('on:')) : null);
}

export function OnDirectiveHandlerCompact(){
    AddDirectiveHandler(OnDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(OnDirectiveExpansionRule);
}
