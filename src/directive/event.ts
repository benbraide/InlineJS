import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";
import { CreateDirective } from "./create";
import { DispatchDirective } from "./dispatch";

export function ForwardEvent(component: IComponent | string, contextElement: HTMLElement, event: string, expression?: string, options?: Array<string>){
    let name = GetGlobal().GetConfig().GetDirectiveName('on'), joinedOptions = (options || []).join('.');
    let qName = (joinedOptions ? `${name}:${event}.${joinedOptions}` : `${name}:${event}`), directive = CreateDirective(qName, (expression || ''));
    return (directive ? DispatchDirective(component, contextElement, directive) : false);
}

export interface IBindEventParams{
    component: IComponent | string;
    contextElement: HTMLElement;
    key?: string,
    event: string;
    expression?: string;
    options?: Array<string>;
    defaultEvent?: string;
    eventWhitelist?: Array<string>;
    optionBlacklist?: Array<string>;
}

const defaultEventList = ['bind', 'event', 'on'];

export function BindEvent({ component, contextElement, key, event, expression, options, defaultEvent, eventWhitelist = [], optionBlacklist }: IBindEventParams){
    let filterOptions = () => (optionBlacklist ? options?.filter(opt => !optionBlacklist.includes(opt)) : options), getEventName = (name: string) => {
        return (key ? `${key}-${event}.join` : event);
    };

    if (eventWhitelist.includes(event)){
        return ForwardEvent(component, contextElement, getEventName(event), expression, filterOptions());
    }
    
    if (defaultEvent && (event === defaultEvent || defaultEventList.includes(event))){
        return ForwardEvent(component, contextElement, getEventName(defaultEvent), expression, filterOptions());
    }

    return false;
}
