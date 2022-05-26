import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { JournalTry } from "../journal/try";
import { UseEffect } from "../reactive/effect";

export interface IInterpolateParams{
    componentId: string;
    contextElement: HTMLElement;
    text?: string;
    handler?: (value: string) => void;
}

export interface IInterpolateTextParams{
    componentId: string;
    contextElement: HTMLElement;
    text: string;
    handler: (value: string) => void;
}

const InterpolateInlineRegex = /\{\{\s*(.+?)\s*\}\}/g;
const InterpolateInlineTestRegex = /\{\{.+?\}\}/;

export function GetElementContent(el: Element){
    let computeContent = (node: Element) => {
        return [...node.childNodes].reduce((prev, child) => `${prev}${((child.nodeType != 3) ? computeText(<Element>child) : (child.textContent || ''))}`, '');
    }

    let computeText = (node: Element) => {
        let tag = ([...node.attributes].reduce((prev, attr) => `${prev} ${attr.name}="${attr.value}"`, `<${node.tagName.toLowerCase()}`) + '>');
        return `${tag}${computeContent(node)}</${node.tagName.toLowerCase()}>`;
    };

    return computeContent(el);
}

export interface IInterpolateTextNode{
    text: string;
    evaluated: string;
}

export function ReplaceText({ componentId, contextElement, text, handler }: IInterpolateTextParams){
    let evaluate = EvaluateLater({ componentId, contextElement,
        expression: "let output = " + JSON.stringify(text).replace(InterpolateInlineRegex, '"+($1)+"') + "; return output;",
    });

    FindComponentById(componentId)?.CreateElementScope(contextElement);
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(handler),
    });
}

export function InterpolateText({ text, ...rest }: IInterpolateTextParams){
    if (InterpolateInlineTestRegex.test(text)){
        ReplaceText({ text, ...rest });
    }
}

export function Interpolate({ componentId, contextElement, text, handler }: IInterpolateParams){
    if (typeof text === 'string'){
        return (handler && InterpolateText({ componentId, contextElement, text, handler }));
    }
    
    if (!InterpolateInlineTestRegex.test(contextElement.textContent || '')){
        return;
    }

    let children = new Array<Element | IInterpolateTextNode | string>(), replaceCallers = new Array<() => void>(), refresh = () => {
        while (contextElement.firstChild){//Empty tree
            contextElement.firstChild.remove();
        }
        
        let previousElement: Element | Text | null = null;
        children.forEach((child) => {
            let element = ((child instanceof Element) ? child : document.createTextNode((typeof child === 'string') ? child : child.evaluated));
            if (previousElement){
                contextElement.insertBefore(element, previousElement);
            }
            else{
                contextElement.append(element);
            }

            previousElement = element;
        });
    };

    [...contextElement.childNodes].forEach((child) => {
        if (child.nodeType == 3 && child.textContent && InterpolateInlineTestRegex.test(child.textContent)){
            let textNode: IInterpolateTextNode = { text: (child.textContent || ''), evaluated: (child.textContent || '') };

            children.push(textNode);
            replaceCallers.push(() => ReplaceText({
                componentId,
                contextElement,
                text: textNode.text,
                handler: (value) => {
                    textNode.evaluated = value;
                    refresh();
                },
            }));
        }
        else if (child.nodeType == 3){
            children.push(child.textContent || '');
        }
        else{
            children.push(<Element>child);
        }
    });

    children.reverse();
    replaceCallers.forEach(caller => JournalTry(caller, 'InlineJS.Interpolate', contextElement));
}
