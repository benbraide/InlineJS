import { FindComponentById, FindComponentByName } from "../component/find";
import { InferComponent } from "../component/infer";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { JournalTry } from "../journal/try";
import { IComponent } from "../types/component";

export function EvaluateMagicProperty(component: IComponent | string, contextElement: HTMLElement, name: string, prefix = '', checkExternal = true){
    const resolvedComponent = ((typeof component === 'string') ? FindComponentById(component) : component);
    if (!resolvedComponent){
        JournalError(`Failed to find component for '$${name}'`, 'InlineJS.EvaluateMagicProperty', contextElement);
        return GetGlobal().CreateNothing();
    }

    let nonPrefixedName = ((prefix && name.startsWith(prefix)) ? name.substring(prefix.length) : name);
    const handler = GetGlobal().GetMagicManager().FindHandler(nonPrefixedName, { contextElement,
        componentId: resolvedComponent.GetId(),
        component: resolvedComponent,
    });//Find handler and report access

    if (!handler){
        if (!checkExternal){
            return GetGlobal().CreateNothing();
        }
        
        const isExternal = ((prefix && name.startsWith(`${prefix}${prefix}`)) || false);

        nonPrefixedName = (isExternal ? nonPrefixedName.substring(prefix.length) : nonPrefixedName);
        
        const foundScope = resolvedComponent.FindScopeByName(nonPrefixedName);
        if (foundScope){
            return (isExternal ? foundScope.GetRoot() : foundScope.GetProxy().GetNative());
        }

        const foundComponent = FindComponentByName(nonPrefixedName);
        if (foundComponent){
            return (isExternal ? foundComponent.GetRoot() : foundComponent.GetRootProxy().GetNative());
        }
        
        if (isExternal){//External access
            const componentId = resolvedComponent.GetId();
            return (target: HTMLElement) => {
                const component = (InferComponent(target) || FindComponentById(componentId));
                if (!component){
                    return null;
                }

                const elementScope = component.FindElementScope(target), local = (elementScope && elementScope.GetLocal(name.substring(prefix.length)));
                if (elementScope && !GetGlobal().IsNothing(local)){//Prioritize local value
                    return local;
                }

                return EvaluateMagicProperty(component.GetId(), target, name, `${prefix}${prefix}`, false);
            };
        }

        return GetGlobal().CreateNothing();
    }

    return JournalTry(() => {//Catch errors
        return handler!({
            componentId: resolvedComponent!.GetId(),
            component: resolvedComponent!,
            contextElement: contextElement,
        });
    }, 'InlineJS.EvaluateMagicProperty', contextElement);
}
