import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { IComponent } from "../../types/component";
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

const DefaultKeyboardTypeDelay = 500;

function BindKeyboardType(component: IComponent | null, contextElement: HTMLElement, delay: number, callback: (typing: boolean) => void){
    let checkpoint = 0, reset = () => {
        ++checkpoint;
    };

    component?.FindElementScope(contextElement)?.AddUninitCallback(reset);
    let lastValue = false, callCallback = (value: boolean) => {
        if (value != lastValue){
            callback(lastValue = value);
        }
    };
    
    let afterDelay = (myCheckpoint: number) => {
        if (myCheckpoint == checkpoint){
            callCallback(false);
        }
    };

    contextElement.addEventListener('keydown', () => {
        let myCheckpoint = ++checkpoint;
        callCallback(true);
        setTimeout(() => afterDelay(myCheckpoint), ((delay < 0) ? DefaultKeyboardTypeDelay : delay));
    });
}

export const KeyboardDirectiveHandler = CreateDirectiveHandlerCallback('keyboard', ({ component, componentId, contextElement, expression, argKey, argOptions }) => {
    let options = ResolveOptions({
        options: {
            delay: -1,
            once: false,
        },
        list: argOptions,
        defaultNumber: -1,
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
    else if (argKey === 'type'){
        BindKeyboardType((component || FindComponentById(componentId)), contextElement, options.delay, assign);
    }
});

export function KeyboardDirectiveHandlerCompact(){
    AddDirectiveHandler(KeyboardDirectiveHandler);
}
