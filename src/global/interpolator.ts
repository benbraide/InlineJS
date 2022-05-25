import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { UseEffect } from "../reactive/effect";

export interface IInterpolateParams{
    componentId: string;
    contextElement: HTMLElement;
    handler: (value: string) => void;
    text?: string;
}

const InterpolateInlineRegex = /\{\{\s*(.+?)\s*\}\}/g;
const InterpolateBlockRegex = /\{%(.+?)%\}/g;

const InterpolateInlineTestRegex = /\{\{.+?\}\}/;
const InterpolateBlockTestRegex = /\{%.+?%\}/;

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

export function Interpolate({ componentId, contextElement, text, handler }: IInterpolateParams){
    let resolvedtext = '';
    if (!text){
        let passesTest = (text: string) => (InterpolateInlineTestRegex.test(text) || InterpolateBlockTestRegex.test(text));
        if (![...contextElement.childNodes].filter(child => (child.nodeType == 3)).find(child => passesTest(child.textContent || ''))){
            return;
        }

        resolvedtext = GetElementContent(contextElement);
    }
    else if (!InterpolateInlineTestRegex.test(text) && !InterpolateBlockTestRegex.test(text)){
        return;
    }

    let replace = () => JSON.stringify(resolvedtext || text).replace(InterpolateInlineRegex, '"+($1)+"').replace(InterpolateBlockRegex, '";$1\noutput+="');
    let evaluate = EvaluateLater({ componentId, contextElement,
        expression: "let output = " + replace() + "; return output;",
    });

    FindComponentById(componentId)?.CreateElementScope(contextElement);
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(handler),
    });
}
