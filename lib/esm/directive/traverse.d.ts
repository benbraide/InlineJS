import { IDirective } from "../types/directive";
export interface ITraverseDirectivesParams {
    element: Element;
    callback: (directive: IDirective) => void;
    attributeCallback?: (name: string, value: string) => void;
}
export declare function TraverseDirectives({ element, callback, attributeCallback }: ITraverseDirectivesParams): void;
