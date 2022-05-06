import { IComponent } from "./component";
interface IProcessorParams {
    contextElement: HTMLElement;
    componentId: string;
    component?: IComponent;
}
export interface IAttributeProcessorParams extends IProcessorParams {
    name: string;
    value: string;
}
export interface ITextContentProcessorParams extends IProcessorParams {
}
export declare type AttributeProcessorType = (params: IAttributeProcessorParams) => void;
export declare type TextContentProcessorType = (params: ITextContentProcessorParams) => void;
export {};
