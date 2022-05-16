"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAttribute = void 0;
const supports_attributes_1 = require("./supports-attributes");
function GetAttribute_(target, attribute) {
    return ((attribute && (0, supports_attributes_1.SupportsAttributes)(target)) ? target.getAttribute(attribute) : null);
}
function GetAttribute(target, attributes) {
    for (let attr of (Array.isArray(attributes) ? attributes : [attributes])) {
        let value = GetAttribute_(target, attr);
        if (value) {
            return value;
        }
    }
    return null;
}
exports.GetAttribute = GetAttribute;
