var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { JournalTry } from "../journal/try";
import { UseEffect } from "../reactive/effect";
import { EncodeValue } from "../utilities/encode-value";
const InterpolateInlineRegex = /\{\{\s*(.+?)\s*\}\}/g;
const InterpolateInlineTestRegex = /\{\{.+?\}\}/;
export function GetElementContent(el) {
    let computeContent = (node) => {
        return [...node.childNodes].reduce((prev, child) => `${prev}${((child.nodeType != 3) ? computeText(child) : (child.textContent || ''))}`, '');
    };
    let computeText = (node) => {
        let tag = ([...node.attributes].reduce((prev, attr) => `${prev} ${attr.name}="${attr.value}"`, `<${node.tagName.toLowerCase()}`) + '>');
        return `${tag}${computeContent(node)}</${node.tagName.toLowerCase()}>`;
    };
    return computeContent(el);
}
export function ReplaceText({ componentId, contextElement, text, handler, testRegex, matchRegex, storeObject }) {
    var _a;
    let evaluate = null, injectedHandler = null;
    if (storeObject) {
        const trimmedtext = text.trim();
        let match = (trimmedtext.match(testRegex || InterpolateInlineTestRegex) || [])[0];
        if (match && match === trimmedtext) {
            match = match.replace((matchRegex || InterpolateInlineRegex), '$1').trim();
            evaluate = match ? EvaluateLater({ componentId, contextElement,
                expression: `return (${match});`,
                voidOnly: true,
            }) : (handler => (handler && handler('')));
            injectedHandler = value => handler(EncodeValue(value, componentId, contextElement));
        }
    }
    if (!evaluate) {
        text = JSON.stringify(text).replace((matchRegex || InterpolateInlineRegex), '"+($1)+"').replace(/"\+\(\s*\)\+"/g, '');
        evaluate = EvaluateLater({ componentId, contextElement,
            expression: `let output = ${text}; return output;`,
        });
    }
    (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement);
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(injectedHandler || handler),
    });
}
export function InterpolateText(_a) {
    var { text, testRegex, matchRegex } = _a, rest = __rest(_a, ["text", "testRegex", "matchRegex"]);
    if ((testRegex || matchRegex || InterpolateInlineTestRegex).test(text)) {
        ReplaceText(Object.assign({ text, testRegex, matchRegex }, rest));
    }
}
export function Interpolate({ componentId, contextElement, text, handler, testRegex, matchRegex }) {
    if (typeof text === 'string') {
        return (handler && InterpolateText({ componentId, contextElement, text, handler, testRegex, matchRegex }));
    }
    if (!(testRegex || matchRegex || InterpolateInlineTestRegex).test(contextElement.textContent || '')) {
        return;
    }
    let children = new Array(), replaceCallers = new Array(), refresh = () => {
        while (contextElement.firstChild) { //Empty tree
            contextElement.firstChild.remove();
        }
        let previousElement = null;
        children.forEach((child) => {
            let element = ((child instanceof Element) ? child : document.createTextNode((typeof child === 'string') ? child : child.evaluated));
            if (previousElement) {
                contextElement.insertBefore(element, previousElement);
            }
            else {
                contextElement.append(element);
            }
            previousElement = element;
        });
    };
    let refreshRequested = false, requestRefresh = () => {
        if (!refreshRequested) {
            refreshRequested = true;
            queueMicrotask(() => {
                refreshRequested = false;
                JournalTry(() => refresh(), 'InlineJS.Interpolate', contextElement);
            });
        }
    };
    [...contextElement.childNodes].forEach((child) => {
        if (child.nodeType == 3 && child.textContent && InterpolateInlineTestRegex.test(child.textContent)) {
            let textNode = { text: (child.textContent || ''), evaluated: (child.textContent || '') };
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
        else if (child.nodeType == 3) {
            children.push(child.textContent || '');
        }
        else {
            children.push(child);
        }
    });
    children.reverse();
    replaceCallers.forEach(caller => JournalTry(caller, 'InlineJS.Interpolate', contextElement));
}
