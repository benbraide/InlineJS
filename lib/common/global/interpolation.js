"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextContentInterpolator = exports.AttributeInterpolator = void 0;
const insert_html_1 = require("../component/insert-html");
const interpolator_1 = require("./interpolator");
function AttributeInterpolator({ componentId, contextElement, name, value }) {
    (0, interpolator_1.Interpolate)({ componentId, contextElement,
        text: value,
        handler: value => contextElement.setAttribute(name, value),
    });
}
exports.AttributeInterpolator = AttributeInterpolator;
function TextContentInterpolator({ componentId, contextElement }) {
    (0, interpolator_1.Interpolate)({ componentId, contextElement,
        handler: value => (0, insert_html_1.InsertHtml)({
            component: componentId,
            element: contextElement,
            html: value,
            processDirectives: true,
        }),
    });
}
exports.TextContentInterpolator = TextContentInterpolator;
