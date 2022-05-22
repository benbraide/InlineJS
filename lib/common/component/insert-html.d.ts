import { IComponent } from "../types/component";
export declare type InsertionType = 'replace' | 'append' | 'prepend';
export interface InsertionOptions {
    element: HTMLElement;
    html: string;
    type?: InsertionType;
    component?: IComponent | string;
    processDirectives?: boolean;
    afterInsert?: () => void;
    afterTransitionCallback?: () => void;
    transitionScope?: HTMLElement;
}
export declare function InsertHtml({ element, html, type, component, processDirectives, afterInsert, afterTransitionCallback, transitionScope }: InsertionOptions): void;
