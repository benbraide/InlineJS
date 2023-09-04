"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodeAttribute = void 0;
const encode_value_1 = require("./encode-value");
const supports_attributes_1 = require("./supports-attributes");
function EncodeAttribute(target, name, value, componentId) {
    (!name || !(0, supports_attributes_1.SupportsAttributes)(target)) && target.setAttribute(name, (0, encode_value_1.EncodeValue)(value, componentId, target));
}
exports.EncodeAttribute = EncodeAttribute;
