import { GetGlobal } from "../global/get";
import { CreateDirective } from "./create";
import { DispatchDirective } from "./dispatch";
export function ForwardEvent(component, contextElement, event, expression, options) {
    let name = GetGlobal().GetConfig().GetDirectiveName('on'), joinedOptions = (options || []).join('.');
    let qName = (joinedOptions ? `${name}:${event}.${joinedOptions}` : `${name}:${event}`), directive = CreateDirective(qName, (expression || ''));
    return (directive ? DispatchDirective(component, contextElement, directive) : false);
}
const defaultEventList = ['bind', 'event', 'on'];
export function BindEvent({ component, contextElement, key, event, expression, options, defaultEvent, eventWhitelist = [], optionBlacklist }) {
    let filterOptions = () => (optionBlacklist ? options === null || options === void 0 ? void 0 : options.filter(opt => !optionBlacklist.includes(opt)) : options), getEventName = (name) => {
        return (key ? `${key}-${name}.join` : name);
    };
    if (eventWhitelist.includes(event)) {
        return ForwardEvent(component, contextElement, getEventName(event), expression, filterOptions());
    }
    if (defaultEvent && (event === defaultEvent || defaultEventList.includes(event))) {
        return ForwardEvent(component, contextElement, getEventName(defaultEvent), expression, filterOptions());
    }
    return false;
}
