"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchDirective = void 0;
const find_1 = require("../component/find");
const get_1 = require("../global/get");
const error_1 = require("../journal/error");
const try_1 = require("../journal/try");
const warn_1 = require("../journal/warn");
const flatten_1 = require("./flatten");
function DispatchDirective(component, element, directive, repeats = 0) {
    let resolvedComponent = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component);
    if (!resolvedComponent) {
        (0, error_1.JournalError)(`Failed to find component for '${directive.meta.view.original}'`, 'InlineJS.DispatchDirective', element);
        return false;
    }
    let handler = null, elementScope = resolvedComponent.FindElementScope(element);
    if (elementScope) { //Check element scope
        handler = elementScope.GetDirectiveManager().FindHandler(directive.meta.name.joined);
        ++repeats;
    }
    handler = (handler || (0, get_1.GetGlobal)().GetDirectiveManager().FindHandler(directive.meta.name.joined));
    if (!handler) { //Try user defined handler
        let camelCaseName = directive.meta.name.parts.reduce((prev, part) => (prev ? `${prev}${part.substring(0, 1).toUpperCase()}${part.substring(1)}` : part), '');
        let key = `${camelCaseName}DirectiveHandler`;
        if (key in globalThis && typeof globalThis[key] === 'function') {
            handler = globalThis[key];
        }
    }
    if (!handler) {
        (0, warn_1.JournalWarn)(`No handler found '${directive.meta.view.original}'`, 'InlineJS.DispatchDirective', element);
        return false;
    }
    if (repeats == 0 && !elementScope) { //Initialize element scope
        resolvedComponent.CreateElementScope(element);
    }
    (0, try_1.JournalTry)(() => {
        handler(Object.assign(Object.assign({}, (0, flatten_1.FlattenDirective)(directive)), { componentId: resolvedComponent.GetId(), component: resolvedComponent, contextElement: element }));
    }, 'InlineJS.DispatchDirective', element);
    return true;
}
exports.DispatchDirective = DispatchDirective;
