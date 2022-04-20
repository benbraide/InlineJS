import { IComponent } from "../types/component";
export declare function ForwardEvent(component: IComponent | string, contextElement: HTMLElement, event: string, expression?: string, options?: Array<string>): boolean;
export interface IBindEventParams {
    component: IComponent | string;
    contextElement: HTMLElement;
    key?: string;
    event: string;
    expression?: string;
    options?: Array<string>;
    defaultEvent?: string;
    eventWhitelist?: Array<string>;
    optionBlacklist?: Array<string>;
}
export declare function BindEvent({ component, contextElement, key, event, expression, options, defaultEvent, eventWhitelist, optionBlacklist }: IBindEventParams): boolean;
