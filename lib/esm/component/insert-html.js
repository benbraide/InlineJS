import { ProcessDirectives } from "../directive/process";
import { FindComponentById } from "./find";
export function InsertHtml({ element, html, type = 'replace', component, processDirectives = true }) {
    let resolvedComponent = (((component && typeof component === 'string') ? FindComponentById(component) : component) || null);
    if (type === 'replace') { //Remove all child nodes
        let destroyOffspring = (el) => {
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
        destroyOffspring(element);
        Array.from(element.childNodes).forEach(child => child.remove());
    }
    let tmpl = document.createElement('template');
    tmpl.innerHTML = html;
    if (type === 'replace' || type === 'append') {
        element.append(...Array.from(tmpl.content.childNodes));
    }
    else if (type === 'prepend') { //Insert before child nodes
        element.prepend(...Array.from(tmpl.content.childNodes));
    }
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
}
