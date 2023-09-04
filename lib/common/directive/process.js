"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessDirectives = exports.IsInsideTemplate = exports.IsTemplate = void 0;
const find_1 = require("../component/find");
const get_1 = require("../global/get");
const error_1 = require("../journal/error");
const dispatch_1 = require("./dispatch");
const traverse_1 = require("./traverse");
function IsTemplate(element) {
    if (element instanceof HTMLTemplateElement) {
        return true;
    }
    if ('IsTemplate' in element && typeof element.IsTemplate === 'function') {
        return !!element.IsTemplate();
    }
    return false;
}
exports.IsTemplate = IsTemplate;
function IsInsideTemplate(element) {
    for (let parent = element.parentNode; parent; parent = parent.parentNode) {
        if (parent instanceof Element && IsTemplate(parent)) {
            return true;
        }
    }
    return false;
}
exports.IsInsideTemplate = IsInsideTemplate;
function CheckElement(element, { checkTemplate = true, checkDocument = true }) {
    return ((element === null || element === void 0 ? void 0 : element.nodeType) === 1 &&
        (!checkDocument || document.contains(element)) &&
        (!checkTemplate || !IsInsideTemplate(element)));
}
function ProcessDirectives({ component, element, options = {} }) {
    if (!CheckElement(element, options)) { //Check failed -- ignore
        return;
    }
    let resolvedComponent = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component);
    if (!resolvedComponent) {
        (0, error_1.JournalError)('Failed to find component.', 'InlineJS.ProcessDirectives', element);
        return false;
    }
    let repeats = 0;
    (0, traverse_1.TraverseDirectives)({ element,
        callback: (directive) => {
            if ((0, dispatch_1.DispatchDirective)(component, element, directive, repeats)) {
                element.removeAttribute(directive.meta.view.original);
                ++repeats; //Prevent multiple element scope initialization attempts
            }
        },
        attributeCallback: (name, value) => (0, get_1.GetGlobal)().DispatchAttributeProcessing({ name, value,
            componentId: resolvedComponent.GetId(),
            component: resolvedComponent,
            contextElement: element,
        }),
    });
    (0, get_1.GetGlobal)().DispatchTextContentProcessing({
        componentId: resolvedComponent.GetId(),
        component: resolvedComponent,
        contextElement: element,
    });
    if ('OnElementScopeCreated' in element && typeof element.OnElementScopeCreated === 'function') {
        resolvedComponent.CreateElementScope(element);
    }
    let elementScope = resolvedComponent.FindElementScope(element);
    elementScope === null || elementScope === void 0 ? void 0 : elementScope.ExecutePostAttributesProcessCallbacks();
    if (!options.ignoreChildren && !IsTemplate(element)) { //Process children
        resolvedComponent.PushSelectionScope();
        let childOptions = {
            checkTemplate: false,
            checkDocument: false,
        };
        let processChildDirectives = (child, ignoreChildren) => ProcessDirectives({
            component,
            options: Object.assign(Object.assign({}, childOptions), { ignoreChildren }),
            element: child,
        });
        if ('TraverseChildren' in element && typeof element.TraverseChildren === 'function') {
            element.TraverseChildren((child) => processChildDirectives(child, child.contains(element)));
        }
        else {
            Array.from(element.children).forEach(child => processChildDirectives(child, child.contains(element)));
        }
        resolvedComponent.PopSelectionScope();
    }
    elementScope === null || elementScope === void 0 ? void 0 : elementScope.ExecutePostProcessCallbacks();
}
exports.ProcessDirectives = ProcessDirectives;
