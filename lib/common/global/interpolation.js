"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextContentInterpolator = exports.AttributeInterpolator = void 0;
const interpolator_1 = require("./interpolator");
function AttributeInterpolator({ componentId, contextElement, name, value }) {
    (0, interpolator_1.InterpolateText)({ componentId, contextElement,
        text: value,
        handler: value => contextElement.setAttribute(name, value),
        storeObject: true,
    });
}
exports.AttributeInterpolator = AttributeInterpolator;
function TextContentInterpolator({ componentId, contextElement }) {
    (0, interpolator_1.Interpolate)({ componentId, contextElement });
}
exports.TextContentInterpolator = TextContentInterpolator;
