import { IComponent } from "../../types/component";
export interface IFormMiddleware {
    GetKey(): string;
    Handle(data?: any, component?: IComponent | string, contextElement?: HTMLElement): Promise<void | boolean>;
}
export declare const FormDirectiveHandler: import("../../types/directives").IDirectiveHandlerCallbackDetails;
export declare function FormDirectiveHandlerCompact(): void;
export declare function AddFormMiddleware(middleware: IFormMiddleware): void;
export declare function RemoveFormMiddleware(name: string): void;
