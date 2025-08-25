"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessDirectives = void 0;
const find_1 = require("../component/find");
const get_1 = require("../global/get");
const error_1 = require("../journal/error");
const template_1 = require("../utilities/template");
const dispatch_1 = require("./dispatch");
const traverse_1 = require("./traverse");
function CheckElement(element, { checkTemplate = true, checkDocument = true }) {
    return ((element === null || element === void 0 ? void 0 : element.nodeType) === 1 &&
        (!checkDocument || document.contains(element)) &&
        (!checkTemplate || !(0, template_1.IsInsideTemplate)(element)));
}
function ProcessDirectives({ component, element, options = {}, proxyAccessHandler }) {
    if (!CheckElement(element, options)) { //Check failed -- ignore
        return;
    }
    const resolvedComponent = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component);
    if (!resolvedComponent) {
        (0, error_1.JournalError)('Failed to find component.', 'InlineJS.ProcessDirectives', element);
        return false;
    }
    let repeats = 0;
    (0, traverse_1.TraverseDirectives)({ element, proxyAccessHandler,
        callback: (directive) => {
            if ((0, dispatch_1.DispatchDirective)(component, element, directive, repeats)) {
                element.removeAttribute(directive.meta.view.original);
                ++repeats; //Prevent multiple element scope initialization attempts
            }
        },
        attributeCallback: (name, value) => (0, get_1.GetGlobal)().DispatchAttributeProcessing({ name, value, proxyAccessHandler,
            componentId: resolvedComponent.GetId(),
            component: resolvedComponent,
            contextElement: element,
        }),
    });
    (0, get_1.GetGlobal)().DispatchTextContentProcessing({
        componentId: resolvedComponent.GetId(),
        component: resolvedComponent,
        contextElement: element,
        proxyAccessHandler,
    });
    if ('OnElementScopeCreated' in element && typeof element.OnElementScopeCreated === 'function') {
        resolvedComponent.CreateElementScope(element);
    }
    const elementScope = resolvedComponent.FindElementScope(element);
    elementScope === null || elementScope === void 0 ? void 0 : elementScope.ExecutePostAttributesProcessCallbacks();
    const componentId = resolvedComponent.GetId(), processChildren = () => {
        const reResolvedComponent = (0, find_1.FindComponentById)(componentId);
        if (reResolvedComponent && !reResolvedComponent.IsDestroyed() && !options.ignoreChildren && !(0, template_1.IsTemplate)(element)) { //Process children
            reResolvedComponent.PushSelectionScope();
            const childOptions = {
                checkTemplate: false,
                checkDocument: false,
            };
            // Important: Use the re-resolved component instance for recursion
            const processChildDirectives = (child, ignoreChildren) => ProcessDirectives({
                component: reResolvedComponent,
                proxyAccessHandler,
                options: Object.assign(Object.assign({}, childOptions), { ignoreChildren }),
                element: child,
            });
            if ('TraverseChildren' in element && typeof element.TraverseChildren === 'function') {
                element.TraverseChildren((child) => processChildDirectives(child, child.contains(element)));
            }
            else {
                Array.from(element.children).forEach(child => processChildDirectives(child, child.contains(element)));
            }
            reResolvedComponent.PopSelectionScope();
        }
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.ExecutePostProcessCallbacks();
    };
    ('ProcessDirectivesCallback' in element) ? element.ProcessDirectivesCallback(processChildren) : processChildren();
}
exports.ProcessDirectives = ProcessDirectives;
