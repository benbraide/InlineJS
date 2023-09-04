"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecodeAttribute = void 0;
const decode_value_1 = require("./decode-value");
const supports_attributes_1 = require("./supports-attributes");
const to_string_1 = require("./to-string");
function DecodeAttribute(target, name, componentId) {
    const value = ((name && (0, supports_attributes_1.SupportsAttributes)(target)) ? target.getAttribute(name) : null);
    return (value ? (0, decode_value_1.DecodeValue)(value, componentId, target) : (0, to_string_1.ToString)(value));
}
exports.DecodeAttribute = DecodeAttribute;
