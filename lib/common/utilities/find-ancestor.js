"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAncestorByTagName = exports.FindAncestorByAttributeValue = exports.FindAncestorByAttribute = exports.FindAncestorByClass = exports.FindAncestor = void 0;
function FindAncestor(target, predicate) {
    for (let ancestor = target.parentNode; ancestor; ancestor = ancestor.parentNode) {
        try {
            if ((ancestor instanceof HTMLElement) && predicate(ancestor)) {
                return ancestor;
            }
        }
        catch (_a) {
            break;
        }
    }
    return null;
}
exports.FindAncestor = FindAncestor;
function FindAncestorByClass(target, className) {
    return FindAncestor(target, (element) => element.classList.contains(className));
}
exports.FindAncestorByClass = FindAncestorByClass;
function FindAncestorByAttribute(target, attributeName) {
    return FindAncestor(target, (element) => element.hasAttribute(attributeName));
}
exports.FindAncestorByAttribute = FindAncestorByAttribute;
function FindAncestorByAttributeValue(target, attributeName, value) {
    return FindAncestor(target, (element) => (element.getAttribute(attributeName) === value));
}
exports.FindAncestorByAttributeValue = FindAncestorByAttributeValue;
function FindAncestorByTagName(target, tagName) {
    return FindAncestor(target, (element) => (element.tagName.toLowerCase() === tagName.toLowerCase()));
}
exports.FindAncestorByTagName = FindAncestorByTagName;
