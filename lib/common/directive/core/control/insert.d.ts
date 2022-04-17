import { IComponent } from "../../../types/component";
export interface InsertCloneParams {
    componentId: string;
    component?: IComponent;
    contextElement: HTMLElement;
    parent: HTMLElement;
    clone: HTMLElement;
    relativeType?: 'before' | 'after';
    relative?: HTMLElement;
    copyLocals?: boolean;
    processDirectives?: boolean;
}
export declare function InsertControlClone({ componentId, component, contextElement, parent, clone, relativeType, relative, copyLocals, processDirectives }: InsertCloneParams): void;
export declare function SetRelativeOffset(component: IComponent | string | null, element: HTMLElement, offset: number): void;
