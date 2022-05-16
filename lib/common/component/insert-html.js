"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertHtml = void 0;
const process_1 = require("../directive/process");
const find_1 = require("./find");
function InsertHtml({ element, html, type = 'replace', component, processDirectives = true }) {
    let resolvedComponent = (((component && typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component) || null);
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
}
exports.InsertHtml = InsertHtml;
