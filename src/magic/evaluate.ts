import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { JournalTry } from "../journal/try";
import { IComponent } from "../types/component";
import { Nothing } from "../values/nothing";

export function EvaluateMagicProperty(component: IComponent | string, contextElement: HTMLElement, name: string, prefix = ''){
    let resolvedComponent = ((typeof component === 'string') ? FindComponentById(component) : component);
    if (!resolvedComponent){
        JournalError(`Failed to find component for '$${name}'`, 'InlineJS.EvaluateMagicProperty', contextElement);
        return new Nothing;
    }

    let handler = GetGlobal().GetMagicManager().FindHandler((prefix && name.startsWith(prefix)) ? name.substring(prefix.length) : name, { contextElement,
        componentId: resolvedComponent.GetId(),
        component: resolvedComponent,
    });//Find handler and report access

    if (!handler){
        return new Nothing;
    }

    return JournalTry(() => {//Catch errors
        return handler!({
            componentId: resolvedComponent!.GetId(),
            component: resolvedComponent!,
            contextElement: contextElement,
        });
    }, 'InlineJS.EvaluateMagicProperty', contextElement);
}
