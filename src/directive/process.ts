import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { IComponent } from "../types/component";
import { DispatchDirective } from "./dispatch";
import { TraverseDirectives } from "./traverse";

export interface IProcessOptions{
    checkTemplate?: boolean;
    checkDocument?: boolean;
    ignoreChildren?: boolean;
}

export interface IProcessDetails{
    component: IComponent | string;
    element: Element;
    options?: IProcessOptions;
}

function CheckElement(element: Element, { checkTemplate = true, checkDocument = true }: IProcessOptions){
    return (element?.nodeType === 1 && (!checkDocument || document.contains(element)) && (!checkTemplate || element instanceof HTMLTemplateElement || !element.closest('template')));
}

export function ProcessDirectives({ component, element, options = {} }: IProcessDetails){
    if (!CheckElement(element, options)){//Check failed -- ignore
        return;
    }

    let resolvedComponent = ((typeof component === 'string') ? FindComponentById(component) : component);
    if (!resolvedComponent){
        JournalError('Failed to find component.', 'InlineJS.ProcessDirectives', element);
        return false;
    }

    let repeats = 0;
    TraverseDirectives({ element,
        callback: (directive) => {
            if (DispatchDirective(component, <HTMLElement>element, directive, repeats)){
                element.removeAttribute(directive.meta.view.original);
                ++repeats;//Prevent multiple element scope initialization attempts
            }
        },
        attributeCallback: (name, value) => GetGlobal().DispatchAttributeProcessing({ name, value,
            componentId: resolvedComponent!.GetId(),
            component: resolvedComponent!,
            contextElement: <HTMLElement>element,
        }),
    });

    GetGlobal().DispatchTextContentProcessing({
        componentId: resolvedComponent!.GetId(),
        component: resolvedComponent!,
        contextElement: <HTMLElement>element,
    });

    if (!options.ignoreChildren && !(element instanceof HTMLTemplateElement)){//Process children
        resolvedComponent?.PushSelectionScope();
        Array.from(element.children).forEach(child => ProcessDirectives({ component, options,
            element: child,
        }));
        resolvedComponent?.PopSelectionScope();
    }

    resolvedComponent?.CreateElementScope(<HTMLElement>element)?.ExecutePostProcessCallbacks();
}
