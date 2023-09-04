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

export function IsTemplate(element: Element){
    if (element instanceof HTMLTemplateElement){
        return true;
    }

    if ('IsTemplate' in element && typeof (element as any).IsTemplate === 'function'){
        return !!(element as any).IsTemplate();
    }

    return false;
}

export function IsInsideTemplate(element: Element){
    for (let parent = element.parentNode; parent; parent = parent.parentNode){
        if (parent instanceof Element && IsTemplate(parent)){
            return true;
        }
    }

    return false;
}

function CheckElement(element: Element, { checkTemplate = true, checkDocument = true }: IProcessOptions){
    return (
        element?.nodeType === 1 &&
        (!checkDocument || document.contains(element)) &&
        (!checkTemplate || !IsInsideTemplate(element))
    );
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
        componentId: resolvedComponent.GetId(),
        component: resolvedComponent,
        contextElement: <HTMLElement>element,
    });

    if ('OnElementScopeCreated' in element && typeof (element as any).OnElementScopeCreated === 'function'){
        resolvedComponent.CreateElementScope((element as unknown as HTMLElement));
    }

    let elementScope = resolvedComponent.FindElementScope(<HTMLElement>element);
    elementScope?.ExecutePostAttributesProcessCallbacks();

    if (!options.ignoreChildren && !IsTemplate(element)){//Process children
        resolvedComponent.PushSelectionScope();

        let childOptions = {
            checkTemplate: false,
            checkDocument: false,
        };

        let processChildDirectives = (child: Element, ignoreChildren: boolean) => ProcessDirectives({
            component,
            options: { ...childOptions, ignoreChildren },
            element: child,
        });

        if ('TraverseChildren' in element && typeof (element as any).TraverseChildren === 'function'){
            (element as any).TraverseChildren((child: Element) => processChildDirectives(child, child.contains(element)));
        }
        else{
            Array.from(element.children).forEach(child => processChildDirectives(child, child.contains(element)));
        }
        
        resolvedComponent.PopSelectionScope();
    }

    elementScope?.ExecutePostProcessCallbacks();
}
