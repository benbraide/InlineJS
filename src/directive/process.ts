import { FindComponentById } from "../component/find";
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

    let repeats = 0;
    TraverseDirectives(element, (directive) => {
        if (DispatchDirective(component, <HTMLElement>element, directive, repeats)){
            element.removeAttribute(directive.meta.view.original);
            ++repeats;//Prevent multiple element scope initialization attempts
        }
    });

    if (!options.ignoreChildren && !(element instanceof HTMLTemplateElement)){//Process children
        Array.from(element.children).forEach(child => ProcessDirectives({ component, options,
            element: child,
        }));
    }

    ((typeof component === 'string') ? FindComponentById(component) : component)?.CreateElementScope(<HTMLElement>element)?.ExecutePostProcessCallbacks();
}
