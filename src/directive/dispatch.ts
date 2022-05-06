import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { JournalTry } from "../journal/try";
import { JournalWarn } from "../journal/warn";
import { IComponent } from "../types/component";
import { IDirective } from "../types/directive";
import { DirectiveHandlerCallbackType } from "../types/directives";
import { FlattenDirective } from "./flatten";

export function DispatchDirective(component: IComponent | string, element: HTMLElement, directive: IDirective, repeats = 0){
    let resolvedComponent = ((typeof component === 'string') ? FindComponentById(component) : component);
    if (!resolvedComponent){
        JournalError(`Failed to find component for '${directive.meta.view.original}'`, 'InlineJS.DispatchDirective', element);
        return false;
    }

    let handler: DirectiveHandlerCallbackType | null = null, elementScope = resolvedComponent.FindElementScope(element);
    if (elementScope){//Check element scope
        handler = elementScope.GetDirectiveManager().FindHandler(directive.meta.name.joined);
        ++repeats;
    }
    
    handler = (handler || GetGlobal().GetDirectiveManager().FindHandler(directive.meta.name.joined));
    if (!handler){//Try user defined handler
        let camelCaseName = directive.meta.name.parts.reduce((prev, part) => (prev ? `${prev}${part.substring(0, 1).toUpperCase()}${part.substring(1)}` : part), '');
        let key = `${camelCaseName}DirectiveHandler`;
        if (key in globalThis && typeof globalThis[key] === 'function'){
            handler = globalThis[key];
        }
    }
    
    if (!handler){
        JournalWarn(`No handler found '${directive.meta.view.original}'`, 'InlineJS.DispatchDirective', element);
        return false;
    }

    if (repeats == 0 && !elementScope){//Initialize element scope
        resolvedComponent.CreateElementScope(element);
    }
    
    JournalTry(() => {//Catch errors
        handler!({ ...FlattenDirective(directive),
            componentId: resolvedComponent!.GetId(),
            component: resolvedComponent!,
            contextElement: element,
        });
    }, 'InlineJS.DispatchDirective', element);

    return true;
}
