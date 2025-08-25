import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { IProcessDetails, IProcessOptions } from "../types/process";
import { IsInsideTemplate, IsTemplate } from "../utilities/template";
import { DispatchDirective } from "./dispatch";
import { TraverseDirectives } from "./traverse";

function CheckElement(element: Element, { checkTemplate = true, checkDocument = true }: IProcessOptions){
    return (
        element?.nodeType === 1 &&
        (!checkDocument || document.contains(element)) &&
        (!checkTemplate || !IsInsideTemplate(element))
    );
}

export function ProcessDirectives({ component, element, options = {}, proxyAccessHandler }: IProcessDetails){
    if (!CheckElement(element, options)){//Check failed -- ignore
        return;
    }

    const resolvedComponent = ((typeof component === 'string') ? FindComponentById(component) : component);
    if (!resolvedComponent){
        JournalError('Failed to find component.', 'InlineJS.ProcessDirectives', element);
        return false;
    }

    let repeats = 0;
    TraverseDirectives({ element, proxyAccessHandler,
        callback: (directive) => {
            if (DispatchDirective(component, <HTMLElement>element, directive, repeats)){
                element.removeAttribute(directive.meta.view.original);
                ++repeats;//Prevent multiple element scope initialization attempts
            }
        },
        attributeCallback: (name, value) => GetGlobal().DispatchAttributeProcessing({ name, value, proxyAccessHandler,
            componentId: resolvedComponent!.GetId(),
            component: resolvedComponent!,
            contextElement: <HTMLElement>element,
        }),
    });

    GetGlobal().DispatchTextContentProcessing({
        componentId: resolvedComponent.GetId(),
        component: resolvedComponent,
        contextElement: <HTMLElement>element,
        proxyAccessHandler,
    });

    if ('OnElementScopeCreated' in element && typeof (element as any).OnElementScopeCreated === 'function'){
        resolvedComponent.CreateElementScope((element as unknown as HTMLElement));
    }

    const elementScope = resolvedComponent.FindElementScope(<HTMLElement>element);
    elementScope?.ExecutePostAttributesProcessCallbacks();
    
    const componentId = resolvedComponent.GetId(), processChildren = () => {
        const reResolvedComponent = FindComponentById(componentId);
        if (reResolvedComponent && !reResolvedComponent.IsDestroyed() && !options.ignoreChildren && !IsTemplate(element)){//Process children
            reResolvedComponent.PushSelectionScope();

            const childOptions = {
                checkTemplate: false,
                checkDocument: false,
            };

            // Important: Use the re-resolved component instance for recursion
            const processChildDirectives = (child: Element, ignoreChildren: boolean) => ProcessDirectives({
                component: reResolvedComponent,
                proxyAccessHandler,
                options: { ...childOptions, ignoreChildren },
                element: child,
            });

            if ('TraverseChildren' in element && typeof (element as any).TraverseChildren === 'function'){
                (element as any).TraverseChildren((child: Element) => processChildDirectives(child, child.contains(element)));
            }
            else{
                Array.from(element.children).forEach(child => processChildDirectives(child, child.contains(element)));
            }
            
            reResolvedComponent.PopSelectionScope();
        }

        elementScope?.ExecutePostProcessCallbacks();
    };

    ('ProcessDirectivesCallback' in (element as any)) ? (element as any).ProcessDirectivesCallback(processChildren) : processChildren();
}
