import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { GeneratedFunctionType } from "../evaluator/generate-function";
import { JournalTry } from "../journal/try";
import { UseEffect } from "../reactive/effect";
import { EncodeValue } from "../utilities/encode-value";

export interface IInterpolateParams{
    componentId: string;
    contextElement: HTMLElement;
    text?: string;
    handler?: (value: string) => void;
    matchRegex?: RegExp;
    testRegex?: RegExp;
}

export interface IInterpolateTextParams{
    componentId: string;
    contextElement: HTMLElement;
    text: string;
    handler: (value: string) => void;
    matchRegex?: RegExp;
    testRegex?: RegExp;
    storeObject?: boolean;
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

export function ReplaceText({ componentId, contextElement, text, handler, testRegex, matchRegex, storeObject }: IInterpolateTextParams){
    let evaluate: GeneratedFunctionType | null = null, injectedHandler: ((value: any) => void) | null = null;
    if (storeObject){
        const trimmedtext = text.trim();
        let match = (trimmedtext.match(testRegex || InterpolateInlineTestRegex) || [])[0];
        if (match && match === trimmedtext){
            match = match.replace((matchRegex || InterpolateInlineRegex), '$1').trim();
            evaluate = match ? EvaluateLater({ componentId, contextElement,
                expression: `return (${match});`,
                voidOnly: true,
            }) : (handler => (handler && handler('')));
            injectedHandler = value => handler(EncodeValue(value, componentId, contextElement));
        }
    }
    
    if (!evaluate){
        text = JSON.stringify(text).replace((matchRegex || InterpolateInlineRegex), '"+($1)+"').replace(/"\+\(\s*\)\+"/g, '');
        evaluate = EvaluateLater({ componentId, contextElement,
            expression: `let output = ${text}; return output;`,
        });
    }

    FindComponentById(componentId)?.CreateElementScope(contextElement);
    UseEffect({ componentId, contextElement,
        callback: () => evaluate!(injectedHandler || handler),
    });
}

export function InterpolateText({ text, testRegex, matchRegex, ...rest }: IInterpolateTextParams){
    if ((testRegex || matchRegex || InterpolateInlineTestRegex).test(text)){
        ReplaceText({ text, testRegex, matchRegex, ...rest });
    }
}

export function Interpolate({ componentId, contextElement, text, handler, testRegex, matchRegex }: IInterpolateParams){
    if (typeof text === 'string'){
        return (handler && InterpolateText({ componentId, contextElement, text, handler, testRegex, matchRegex }));
    }
    
    if (!(testRegex || matchRegex || InterpolateInlineTestRegex).test(contextElement.textContent || '')){
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

    let refreshRequested = false, requestRefresh = () => {
        if (!refreshRequested){
            refreshRequested = true;
            queueMicrotask(() => {
                refreshRequested = false;
                JournalTry(() => refresh(), 'InlineJS.Interpolate', contextElement);
            });
        }
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
                    requestRefresh();
                },
                testRegex, matchRegex,
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
