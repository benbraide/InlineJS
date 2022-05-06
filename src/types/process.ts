import { IComponent } from "./component";

interface IProcessorParams{
    contextElement: HTMLElement;
    componentId: string;
    component?: IComponent;
}

export interface IAttributeProcessorParams extends IProcessorParams{
    name: string;
    value: string;
}

export interface ITextContentProcessorParams extends IProcessorParams{}

export type AttributeProcessorType = (params: IAttributeProcessorParams) => void;
export type TextContentProcessorType = (params: ITextContentProcessorParams) => void;
