import { IAttributeProcessorParams, ITextContentProcessorParams } from "../types/process";
import { Interpolate, InterpolateText } from "./interpolator";

export function AttributeInterpolator({ componentId, contextElement, name, value }: IAttributeProcessorParams){
    InterpolateText({ componentId, contextElement,
        text: value,
        handler: value => contextElement.setAttribute(name, value),
        storeObject: true,
    });
}

export function TextContentInterpolator({ componentId, contextElement }: ITextContentProcessorParams){
    Interpolate({ componentId, contextElement });
}
