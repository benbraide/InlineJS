"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindFirstAttributeValue = exports.FindFirstAttribute = exports.GetAttribute = void 0;
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
function FindFirstAttribute(target, attributes) {
    if (!(0, supports_attributes_1.SupportsAttributes)(target)) {
        return null;
    }
    for (let attribute of attributes) {
        if (target.hasAttribute(attribute)) {
            return {
                name: attribute,
                value: target.getAttribute(attribute),
            };
        }
    }
    return null;
}
exports.FindFirstAttribute = FindFirstAttribute;
function FindFirstAttributeValue(target, attributes) {
    let info = FindFirstAttribute(target, attributes);
    return (info ? info.value : null);
}
exports.FindFirstAttributeValue = FindFirstAttributeValue;
