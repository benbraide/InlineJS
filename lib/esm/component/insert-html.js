import { ProcessDirectives } from "../directive/process";
import { WaitTransition } from "../directive/transition";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { FindComponentById } from "./find";
export function InsertHtml({ element, html, type = 'replace', component, processDirectives = true, afterRemove, afterInsert, afterTransitionCallback, transitionScope }) {
    let componentId = ((typeof component === 'string') ? component : ((component === null || component === void 0 ? void 0 : component.GetId()) || '')), insert = () => {
        let tmpl = document.createElement('template');
        tmpl.innerHTML = html;
        if (type === 'replace' || type === 'append') {
            element.append(...Array.from(tmpl.content.childNodes));
        }
        else if (type === 'prepend') { //Insert before child nodes
            element.prepend(...Array.from(tmpl.content.childNodes));
        }
        (afterInsert && JournalTry(afterInsert, 'InlineJS.InsertHtml', element));
        let resolvedComponent = FindComponentById(componentId);
        if (processDirectives && resolvedComponent) {
            Array.from(element.children).forEach(child => ProcessDirectives({
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
            WaitTransition({ componentId,
                contextElement: (transitionScope || element),
                target: element,
                callback: () => (((transitionScope || element).dispatchEvent(new CustomEvent('html.transition.end', { detail: { insert: true } })) && false) || afterTransitionCallback()),
            });
        }
    };
    if (type === 'replace') { //Remove all child nodes
        let destroyOffspring = (el) => {
            let resolvedComponent = FindComponentById(componentId), global = GetGlobal();
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
        let remove = () => {
            destroyOffspring(element);
            Array.from(element.childNodes).forEach(child => child.remove());
            (afterRemove && JournalTry(afterRemove, 'InlineJS.InsertHtml', element));
            insert();
        };
        if (afterTransitionCallback) {
            (transitionScope || element).dispatchEvent(new CustomEvent('html.transition.begin', { detail: { insert: false } }));
            WaitTransition({ componentId,
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
