"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessDirectives = void 0;
const find_1 = require("../component/find");
const get_1 = require("../global/get");
const error_1 = require("../journal/error");
const dispatch_1 = require("./dispatch");
const traverse_1 = require("./traverse");
function CheckElement(element, { checkTemplate = true, checkDocument = true }) {
    return ((element === null || element === void 0 ? void 0 : element.nodeType) === 1 &&
        (!checkDocument || document.contains(element)) &&
        (!checkTemplate || element instanceof HTMLTemplateElement || !element.closest('template')));
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
    if (!options.ignoreChildren && !(element instanceof HTMLTemplateElement)) { //Process children
        resolvedComponent.PushSelectionScope();
        Array.from(element.children).filter(child => !child.contains(element)).forEach(child => ProcessDirectives({ component, options,
            element: child,
        }));
        resolvedComponent.PopSelectionScope();
    }
    elementScope === null || elementScope === void 0 ? void 0 : elementScope.ExecutePostProcessCallbacks();
}
exports.ProcessDirectives = ProcessDirectives;
