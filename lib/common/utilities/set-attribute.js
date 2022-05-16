"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAttributeUtil = void 0;
const supports_attributes_1 = require("./supports-attributes");
function SetAttributeUtil(target, attribute, value) {
    if ((attribute && (0, supports_attributes_1.SupportsAttributes)(target))) {
        target.setAttribute(attribute, value);
    }
}
exports.SetAttributeUtil = SetAttributeUtil;
