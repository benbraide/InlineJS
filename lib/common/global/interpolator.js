"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpolate = exports.InterpolateText = exports.ReplaceText = exports.GetElementContent = void 0;
const find_1 = require("../component/find");
const evaluate_later_1 = require("../evaluator/evaluate-later");
const try_1 = require("../journal/try");
const effect_1 = require("../reactive/effect");
const encode_value_1 = require("../utilities/encode-value");
const InterpolateInlineRegex = /\{\{\s*(.+?)\s*\}\}/g;
const InterpolateInlineTestRegex = /\{\{.+?\}\}/;
function GetElementContent(el) {
    const computeContent = (node) => {
        return [...node.childNodes].reduce((prev, child) => `${prev}${((child.nodeType != 3) ? computeText(child) : (child.textContent || ''))}`, '');
    };
    const computeText = (node) => {
        const tag = ([...node.attributes].reduce((prev, attr) => `${prev} ${attr.name}="${attr.value}"`, `<${node.tagName.toLowerCase()}`) + '>');
        return `${tag}${computeContent(node)}</${node.tagName.toLowerCase()}>`;
    };
    return computeContent(el);
}
exports.GetElementContent = GetElementContent;
function ReplaceText({ componentId, contextElement, text, handler, testRegex, matchRegex, storeObject }) {
    var _a;
    let evaluate = null, injectedHandler = null;
    if (storeObject) {
        const trimmedtext = text.trim();
        let match = (trimmedtext.match(testRegex || InterpolateInlineTestRegex) || [])[0];
        if (match && match === trimmedtext) {
            match = match.replace((matchRegex || InterpolateInlineRegex), '$1').trim();
            evaluate = match ? (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement,
                expression: `return (${match});`,
                voidOnly: true,
            }) : (handler => (handler && handler('')));
            injectedHandler = value => handler((0, encode_value_1.EncodeValue)(value, componentId, contextElement));
        }
    }
    if (!evaluate) {
        text = JSON.stringify(text).replace((matchRegex || InterpolateInlineRegex), '"+($1)+"').replace(/"\+\(\s*\)\+"/g, '');
        evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement,
            expression: `const output = ${text}; return output;`,
        });
    }
    (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement);
    (0, effect_1.UseEffect)({ componentId, contextElement,
        callback: () => evaluate(injectedHandler || handler),
    });
}
exports.ReplaceText = ReplaceText;
function InterpolateText(_a) {
    var { text, testRegex, matchRegex } = _a, rest = __rest(_a, ["text", "testRegex", "matchRegex"]);
    if ((testRegex || matchRegex || InterpolateInlineTestRegex).test(text)) {
        ReplaceText(Object.assign({ text, testRegex, matchRegex }, rest));
    }
}
exports.InterpolateText = InterpolateText;
function Interpolate({ componentId, contextElement, text, handler, testRegex, matchRegex }) {
    if (typeof text === 'string') {
        return (handler && InterpolateText({ componentId, contextElement, text, handler, testRegex, matchRegex }));
    }
    if (!(testRegex || matchRegex || InterpolateInlineTestRegex).test(contextElement.textContent || '')) {
        return;
    }
    const children = new Array(), replaceCallers = new Array(), refresh = () => {
        while (contextElement.firstChild) { //Empty tree
            contextElement.firstChild.remove();
        }
        let previousElement = null;
        children.forEach((child) => {
            const element = ((child instanceof Element) ? child : document.createTextNode((typeof child === 'string') ? child : child.evaluated));
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
                (0, try_1.JournalTry)(() => refresh(), 'InlineJS.Interpolate', contextElement);
            });
        }
    };
    [...contextElement.childNodes].forEach((child) => {
        if (child.nodeType == 3 && child.textContent && InterpolateInlineTestRegex.test(child.textContent)) {
            const textNode = { text: (child.textContent || ''), evaluated: (child.textContent || '') };
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
    replaceCallers.forEach(caller => (0, try_1.JournalTry)(caller, 'InlineJS.Interpolate', contextElement));
}
exports.Interpolate = Interpolate;
