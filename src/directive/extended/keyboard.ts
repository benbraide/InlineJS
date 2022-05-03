import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { ResolveOptions } from "../options";

function BindKeyboardInside(contextElement: HTMLElement, callback: (isInside: boolean, unbind: () => void) => void){
    let lastValue = false, callCallback = (value: boolean) => {
        if (value != lastValue){
            callback((lastValue = value), unbind);
        }
    };
    
    let onEnter = () => callCallback(true), onLeave = () => callCallback(false), unbind = () => {
        contextElement.removeEventListener('focusout', onLeave);
        contextElement.removeEventListener('focusin', onEnter);
    };
    
    contextElement.addEventListener('focusin', onEnter);
    contextElement.addEventListener('focusout', onLeave);
}

function BindKeyboardKey(contextElement: HTMLElement, key: 'down' | 'up', callback: (key: string) => void){
    let lastValue = '', callCallback = (value: string) => {
        if (value !== lastValue){
            callback(lastValue = value);
        }
    };
    contextElement.addEventListener(`key${key}`, (e) => callCallback(e.key));
}

export const KeyboardDirectiveHandler = CreateDirectiveHandlerCallback('keyboard', ({ componentId, contextElement, expression, argKey, argOptions }) => {
    let options = ResolveOptions({
        options: {
            once: false,
        },
        list: argOptions,
    });
    
    let assign = (value: any) => {
        EvaluateLater({ componentId, contextElement,
            expression: `(${expression}) = (${JSON.stringify(value)})`,
        })();
    };

    if (argKey === 'inside'){
        BindKeyboardInside(contextElement, (value, unbind) => {
            assign(value);
            if (options.once){
                unbind();
            }
        });
    }
    else if (argKey === 'down' || argKey === 'up'){
        BindKeyboardKey(contextElement, argKey, assign);
    }
});

export function KeyboardDirectiveHandlerCompact(){
    AddDirectiveHandler(KeyboardDirectiveHandler);
}
