import { InsertHtml } from "../component/insert-html";
import { IAttributeProcessorParams, ITextContentProcessorParams } from "../types/process";
import { Interpolate } from "./interpolator";

export function AttributeInterpolator({ componentId, contextElement, name, value }: IAttributeProcessorParams){
    Interpolate({ componentId, contextElement,
        text: value,
        handler: value => contextElement.setAttribute(name, value),
    });
}

export function TextContentInterpolator({ componentId, contextElement }: ITextContentProcessorParams){
    Interpolate({ componentId, contextElement,
        handler: value => InsertHtml({
            component: componentId,
            element: contextElement,
            html: value,
            processDirectives: true,
        }),
    });
}
