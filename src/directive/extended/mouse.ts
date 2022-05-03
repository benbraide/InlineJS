import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { IComponent } from "../../types/component";
import { ResolveOptions } from "../options";

function BindMouseInside(contextElement: HTMLElement, callback: (isInside: boolean, unbind: () => void) => void){
    let lastValue = false, callCallback = (value: boolean) => {
        if (value != lastValue){
            callback((lastValue = value), unbind);
        }
    };
    
    let onEnter = () => callCallback(true), onLeave = () => callCallback(false), unbind = () => {
        contextElement.removeEventListener('mouseleave', onLeave);
        contextElement.removeEventListener('mouseenter', onEnter);
    };
    
    contextElement.addEventListener('mouseenter', onEnter);
    contextElement.addEventListener('mouseleave', onLeave);
}

const DefaultMouseDelay = 100;
const DefaultMouseDebounce = 250;

function BindMouseRepeat(component: IComponent | null, contextElement: HTMLElement, delay: number, callback: (streak: number) => void){
    let checkpoint = 0, streak = 0, reset = () => {
        ++checkpoint;
        streak = 0;
    };

    component?.FindElementScope(contextElement)?.AddUninitCallback(reset);
    let afterDelay = (myCheckpoint: number) => {
        if (myCheckpoint == checkpoint){
            callback(++streak);
            setTimeout(() => afterDelay(myCheckpoint), ((delay < 0) ? DefaultMouseDelay : delay));
        }
    };

    contextElement.addEventListener('mousedown', () => {
        let myCheckpoint = ++checkpoint;
        callback(++streak);
        setTimeout(() => afterDelay(myCheckpoint), ((delay < 0) ? DefaultMouseDebounce : delay));
    });

    contextElement.addEventListener('mouseup', reset);
    contextElement.addEventListener('mouseenter', reset);
    contextElement.addEventListener('mouseleave', reset);
    contextElement.addEventListener('mouseover', reset);
    contextElement.addEventListener('mouseout', reset);
}

interface IMouseCoordinate{
    client: { x: number, y: number };
    offset: { x: number, y: number };
    screen: { x: number, y: number };
}

function BindMouseMove(contextElement: HTMLElement, callback: (count: IMouseCoordinate | null) => void){
    contextElement.addEventListener('mousemove', e => callback({
        client: { x: e.clientX, y: e.clientY },
        offset: { x: e.offsetX, y: e.offsetY },
        screen: { x: e.screenX, y: e.screenY },
    }));

    contextElement.addEventListener('mouseleave', () => callback(null));
}

export const MouseDirectiveHandler = CreateDirectiveHandlerCallback('mouse', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    let options = ResolveOptions({
        options: {
            delay: -1,
            debounce: -1,
            once: false,
        },
        list: argOptions,
        defaultNumber: -1,
    });

    if (argKey === 'repeat'){
        let evaluate = EvaluateLater({ componentId, contextElement, expression });
        return BindMouseRepeat((component || FindComponentById(componentId)), contextElement, options.delay, streak => evaluate(undefined, [streak], { streak }));
    }
    
    let assign = (value: any) => {
        EvaluateLater({ componentId, contextElement,
            expression: `(${expression}) = (${JSON.stringify(value)})`,
        })();
    };

    if (argKey === 'inside'){
        BindMouseInside(contextElement, (value, unbind) => {
            assign(value);
            if (options.once){
                unbind();
            }
        });
    }
    else if (argKey === 'move'){
        BindMouseMove(contextElement, assign);
    }
});

export function MouseDirectiveHandlerCompact(){
    AddDirectiveHandler(MouseDirectiveHandler);
}
