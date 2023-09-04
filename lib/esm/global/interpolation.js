import { Interpolate, InterpolateText } from "./interpolator";
export function AttributeInterpolator({ componentId, contextElement, name, value }) {
    InterpolateText({ componentId, contextElement,
        text: value,
        handler: value => contextElement.setAttribute(name, value),
        storeObject: true,
    });
}
export function TextContentInterpolator({ componentId, contextElement }) {
    Interpolate({ componentId, contextElement });
}
