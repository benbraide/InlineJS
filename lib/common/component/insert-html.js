"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertHtml = void 0;
const process_1 = require("../directive/process");
const transition_1 = require("../directive/transition");
const try_1 = require("../journal/try");
const find_1 = require("./find");
function InsertHtml({ element, html, type = 'replace', component, processDirectives = true, afterInsert, afterTransitionCallback, transitionScope }) {
    let componentId = ((typeof component === 'string') ? component : ((component === null || component === void 0 ? void 0 : component.GetId()) || '')), insert = () => {
        let tmpl = document.createElement('template');
        tmpl.innerHTML = html;
        if (type === 'replace' || type === 'append') {
            element.append(...Array.from(tmpl.content.childNodes));
        }
        else if (type === 'prepend') { //Insert before child nodes
            element.prepend(...Array.from(tmpl.content.childNodes));
        }
        (afterInsert && (0, try_1.JournalTry)(afterInsert, 'InlineJS.InsertHtml', element));
        let resolvedComponent = (0, find_1.FindComponentById)(componentId);
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
        if (afterTransitionCallback) {
            (transitionScope || element).dispatchEvent(new CustomEvent('html.transition.begin', { detail: { insert: true } }));
            (0, transition_1.WaitTransition)({ componentId,
                contextElement: (transitionScope || element),
                target: element,
                callback: () => (((transitionScope || element).dispatchEvent(new CustomEvent('html.transition.end', { detail: { insert: true } })) && false) || afterTransitionCallback()),
            });
        }
    };
    if (type === 'replace') { //Remove all child nodes
        let destroyOffspring = (el) => {
            let resolvedComponent = (0, find_1.FindComponentById)(componentId);
            Array.from(el.children).forEach((child) => {
                let elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindElementScope(child);
                if (elementScope) {
                    elementScope.Destroy();
                }
                else {
                    destroyOffspring(child);
                }
            });
        };
        let remove = () => {
            destroyOffspring(element);
            Array.from(element.childNodes).forEach(child => child.remove());
            insert();
        };
        if (afterTransitionCallback) {
            (transitionScope || element).dispatchEvent(new CustomEvent('html.transition.begin', { detail: { insert: false } }));
            (0, transition_1.WaitTransition)({ componentId,
                contextElement: (transitionScope || element),
                target: element,
                reverse: true,
                callback: () => (((transitionScope || element).dispatchEvent(new CustomEvent('html.transition.end', { detail: { insert: false } })) && false) || remove()),
            });
        }
        else {
            remove();
        }
    }
    else {
        insert();
    }
}
exports.InsertHtml = InsertHtml;
