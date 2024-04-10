import { FindComponentById } from "../component/find";
import { SetProxyAccessHandler } from "../component/set-proxy-access-handler";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { JournalTry } from "../journal/try";
import { JournalWarn } from "../journal/warn";
import { FlattenDirective } from "./flatten";
export function DispatchDirective(component, element, directive, repeats = 0) {
    const resolvedComponent = ((typeof component === 'string') ? FindComponentById(component) : component);
    if (!resolvedComponent) {
        JournalError(`Failed to find component for '${directive.meta.view.original}'`, 'InlineJS.DispatchDirective', element);
        return false;
    }
    let handler = null, elementScope = resolvedComponent.FindElementScope(element), proxyAccessHandler = null;
    if (elementScope) { //Check element scope
        handler = elementScope.GetDirectiveManager().FindHandler(directive.meta.name.joined);
        ++repeats;
    }
    handler = (handler || GetGlobal().GetDirectiveManager().FindHandler(directive.meta.name.joined));
    if (!handler) { //Try user defined handler
        const camelCaseName = directive.meta.name.parts.reduce((prev, part) => (prev ? `${prev}${part.substring(0, 1).toUpperCase()}${part.substring(1)}` : part), '');
        const key = `${camelCaseName}DirectiveHandler`;
        (key in globalThis && typeof globalThis[key] === 'function') && (handler = globalThis[key]);
    }
    if (!handler) {
        JournalWarn(`No handler found '${directive.meta.view.original}'`, 'InlineJS.DispatchDirective', element);
        return false;
    }
    const pahCallback = SetProxyAccessHandler(resolvedComponent, (directive.proxyAccessHandler || null));
    (repeats == 0 && !elementScope) && resolvedComponent.CreateElementScope(element); //Initialize element scope
    JournalTry(() => {
        handler(Object.assign(Object.assign({}, FlattenDirective(directive)), { componentId: resolvedComponent.GetId(), component: resolvedComponent, contextElement: element }));
    }, 'InlineJS.DispatchDirective', element);
    pahCallback();
    return true;
}
