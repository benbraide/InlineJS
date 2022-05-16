import { IAttributeProcessorParams, ITextContentProcessorParams } from "../types/process";
export declare function AttributeInterpolator({ componentId, contextElement, name, value }: IAttributeProcessorParams): void;
export declare function TextContentInterpolator({ componentId, contextElement }: ITextContentProcessorParams): void;
