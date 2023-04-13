import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { DispatchDirective } from "./dispatch";
import { TraverseDirectives } from "./traverse";
function CheckElement(element, { checkTemplate = true, checkDocument = true }) {
    return ((element === null || element === void 0 ? void 0 : element.nodeType) === 1 &&
        (!checkDocument || document.contains(element)) &&
        (!checkTemplate || element instanceof HTMLTemplateElement || !element.closest('template')));
}
export function ProcessDirectives({ component, element, options = {} }) {
    if (!CheckElement(element, options)) { //Check failed -- ignore
        return;
    }
    let resolvedComponent = ((typeof component === 'string') ? FindComponentById(component) : component);
    if (!resolvedComponent) {
        JournalError('Failed to find component.', 'InlineJS.ProcessDirectives', element);
        return false;
    }
    let repeats = 0;
    TraverseDirectives({ element,
        callback: (directive) => {
            if (DispatchDirective(component, element, directive, repeats)) {
                element.removeAttribute(directive.meta.view.original);
                ++repeats; //Prevent multiple element scope initialization attempts
            }
        },
        attributeCallback: (name, value) => GetGlobal().DispatchAttributeProcessing({ name, value,
            componentId: resolvedComponent.GetId(),
            component: resolvedComponent,
            contextElement: element,
        }),
    });
    GetGlobal().DispatchTextContentProcessing({
        componentId: resolvedComponent.GetId(),
        component: resolvedComponent,
        contextElement: element,
    });
    if (element.hasOwnProperty('OnElementScopeCreated') && typeof element.OnElementScopeCreated === 'function') {
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
