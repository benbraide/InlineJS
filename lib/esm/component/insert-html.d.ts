import { IComponent } from "../types/component";
export type InsertionType = 'replace' | 'append' | 'prepend';
export interface InsertionOptions {
    element: HTMLElement;
    html: string;
    type?: InsertionType;
    component?: IComponent | string;
    processDirectives?: boolean;
    beforeRemove?: (beforeTransition: boolean) => void | boolean;
    afterRemove?: () => void;
    beforeInsert?: () => void | boolean;
    afterInsert?: () => void;
    afterTransitionCallback?: () => void;
    transitionScope?: HTMLElement;
    useTransition?: boolean;
}
export declare function InsertHtml({ element, html, type, component, processDirectives, beforeRemove, afterRemove, beforeInsert, afterInsert, afterTransitionCallback, transitionScope, useTransition }: InsertionOptions): void;
