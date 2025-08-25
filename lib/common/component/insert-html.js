"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertHtml = void 0;
const process_1 = require("../directive/process");
const transition_1 = require("../directive/transition");
const get_1 = require("../global/get");
const try_1 = require("../journal/try");
const find_1 = require("./find");
const dompurify_1 = __importDefault(require("dompurify"));
function InsertHtml({ element, html, type = 'replace', component, processDirectives = true, beforeRemove, afterRemove, beforeInsert, afterInsert, afterTransitionCallback, transitionScope, useTransition }) {
    const componentId = ((typeof component === 'string') ? component : ((component === null || component === void 0 ? void 0 : component.GetId()) || '')), insert = () => {
        if ((beforeInsert && (0, try_1.JournalTry)(beforeInsert, 'InlineJS.InsertHtml', element)) === false) {
            return;
        }
        const tmpl = document.createElement('template');
        tmpl.innerHTML = dompurify_1.default.sanitize(html);
        if (type === 'replace' || type === 'append') {
            element.append(...Array.from(tmpl.content.childNodes));
        }
        else if (type === 'prepend') { //Insert before child nodes
            element.prepend(...Array.from(tmpl.content.childNodes));
        }
        afterInsert && (0, try_1.JournalTry)(afterInsert, 'InlineJS.InsertHtml', element);
        const resolvedComponent = (0, find_1.FindComponentById)(componentId);
        if (processDirectives && resolvedComponent) {
            Array.from(element.children).forEach(child => (0, process_1.ProcessDirectives)({
                component: resolvedComponent,
                element: child,
                options: {
                    checkTemplate: true,
                    checkDocument: true,
                    ignoreChildren: false,
                },
            }));
        }
        if (afterTransitionCallback || useTransition) {
            (transitionScope || element).dispatchEvent(new CustomEvent('html.transition.begin', { detail: { insert: true } }));
            (0, transition_1.WaitTransition)({ componentId,
                contextElement: (transitionScope || element),
                target: element,
                callback: () => {
                    (transitionScope || element).dispatchEvent(new CustomEvent('html.transition.end', { detail: { insert: true } }));
                    afterTransitionCallback && afterTransitionCallback();
                },
            });
        }
    };
    const destroyOffspring = (el) => {
        const resolvedComponent = (0, find_1.FindComponentById)(componentId), global = (0, get_1.GetGlobal)();
        Array.from(el.children).forEach((child) => {
            var _a;
            let elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindElementScope(child);
            if (elementScope || (elementScope = (_a = global.InferComponentFrom(child)) === null || _a === void 0 ? void 0 : _a.FindElementScope(child))) {
                elementScope.Destroy();
            }
            else {
                destroyOffspring(child);
            }
        });
    };
    const remove = () => {
        if ((beforeRemove && (0, try_1.JournalTry)(() => beforeRemove(false), 'InlineJS.InsertHtml', element)) === false) {
            return;
        }
        destroyOffspring(element);
        Array.from(element.childNodes).forEach(child => child.remove());
        afterRemove && (0, try_1.JournalTry)(afterRemove, 'InlineJS.InsertHtml', element);
    };
    if (type === 'replace' && element.childNodes.length != 0) { //Remove all child nodes
        if ((beforeRemove && (0, try_1.JournalTry)(() => beforeRemove(true), 'InlineJS.InsertHtml', element)) === false) {
            return;
        }
        if (afterTransitionCallback || useTransition) {
            (transitionScope || element).dispatchEvent(new CustomEvent('html.transition.begin', { detail: { insert: false } }));
            (0, transition_1.WaitTransition)({ componentId,
                contextElement: (transitionScope || element),
                target: element,
                reverse: true,
                callback: () => {
                    (transitionScope || element).dispatchEvent(new CustomEvent('html.transition.end', { detail: { insert: false } }));
                    remove();
                    insert();
                },
            });
        }
        else {
            remove();
            insert();
        }
    }
    else {
        insert();
    }
}
exports.InsertHtml = InsertHtml;
