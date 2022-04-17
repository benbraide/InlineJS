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
export declare function ProcessDirectives({ component, element, options }: IProcessDetails): void;
