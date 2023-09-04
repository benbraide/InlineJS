import { IComponent } from "../types/component";
export interface IProcessOptions {
    checkTemplate?: boolean;
    checkDocument?: boolean;
    ignoreChildren?: boolean;
}
export interface IProcessDetails {
    component: IComponent | string;
    element: Element;
    options?: IProcessOptions;
}
export declare function IsTemplate(element: Element): boolean;
export declare function IsInsideTemplate(element: Element): boolean;
export declare function ProcessDirectives({ component, element, options }: IProcessDetails): false | undefined;
