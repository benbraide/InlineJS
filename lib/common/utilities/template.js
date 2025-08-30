"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsInsideTemplate = exports.IsTemplate = void 0;
const is_custom_element_1 = require("./is-custom-element");
function IsTemplate(element) {
    if (element instanceof HTMLTemplateElement) {
        return true;
    }
    return (0, is_custom_element_1.IsCustomElement)(element) && element.IsTemplate();
}
exports.IsTemplate = IsTemplate;
function IsInsideTemplate(element) {
    for (let parent = element.parentNode; parent; parent = parent.parentNode) {
        if (parent instanceof Element && IsTemplate(parent)) {
            return true;
        }
    }
    return false;
}
exports.IsInsideTemplate = IsInsideTemplate;
