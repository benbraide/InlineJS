import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { IsCustomElement } from "../utilities/is-custom-element";
import { IsInsideTemplate, IsTemplate } from "../utilities/template";
import { DispatchDirective } from "./dispatch";
import { TraverseDirectives } from "./traverse";
function CheckElement(element, { checkTemplate = true, checkDocument = true }) {
    return ((element === null || element === void 0 ? void 0 : element.nodeType) === 1 &&
        (!checkDocument || document.contains(element)) &&
        (!checkTemplate || !IsInsideTemplate(element)));
}
export function ProcessDirectives({ component, element, options = {}, proxyAccessHandler }) {
    if (!CheckElement(element, options)) { //Check failed -- ignore
        return;
    }
    const resolvedComponent = ((typeof component === 'string') ? FindComponentById(component) : component);
    if (!resolvedComponent) {
        JournalError('Failed to find component.', 'InlineJS.ProcessDirectives', element);
        return false;
    }
    if (resolvedComponent.IsDestroyed()) {
        JournalError('Component is destroyed.', 'InlineJS.ProcessDirectives', element);
        return false;
    }
    let repeats = 0;
    TraverseDirectives({ element, proxyAccessHandler,
        callback: (directive) => {
            if (DispatchDirective(component, element, directive, repeats)) {
                element.removeAttribute(directive.meta.view.original);
                ++repeats; //Prevent multiple element scope initialization attempts
            }
        },
        attributeCallback: (name, value) => GetGlobal().DispatchAttributeProcessing({ name, value, proxyAccessHandler,
            componentId: resolvedComponent.GetId(),
            component: resolvedComponent,
            contextElement: element,
        }),
    });
    !IsTemplate(element) && GetGlobal().DispatchTextContentProcessing({
        componentId: resolvedComponent.GetId(),
        component: resolvedComponent,
        contextElement: element,
        proxyAccessHandler,
    });
    if (IsCustomElement(element)) { // Element is defined as custom
        resolvedComponent.CreateElementScope(element);
    }
    const elementScope = resolvedComponent.FindElementScope(element);
    elementScope === null || elementScope === void 0 ? void 0 : elementScope.ExecutePostAttributesProcessCallbacks();
    const componentId = resolvedComponent.GetId(), processChildren = () => {
        const reResolvedComponent = FindComponentById(componentId);
        if (reResolvedComponent && !reResolvedComponent.IsDestroyed() && !options.ignoreChildren && !IsTemplate(element)) { //Process children
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
