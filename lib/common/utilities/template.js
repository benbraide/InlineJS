"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsInsideTemplate = exports.IsTemplate = void 0;
function IsTemplate(element) {
    if (element instanceof HTMLTemplateElement) {
        return true;
    }
    if ('IsTemplate' in element && typeof element.IsTemplate === 'function') {
        return !!element.IsTemplate();
    }
    return false;
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
