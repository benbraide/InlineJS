export function FindAncestor(target, predicate) {
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
export function FindAncestorByClass(target, className) {
    return FindAncestor(target, (element) => element.classList.contains(className));
}
export function FindAncestorByAttribute(target, attributeName) {
    return FindAncestor(target, (element) => element.hasAttribute(attributeName));
}
export function FindAncestorByAttributeValue(target, attributeName, value) {
    return FindAncestor(target, (element) => (element.getAttribute(attributeName) === value));
}
export function FindAncestorByTagName(target, tagName) {
    return FindAncestor(target, (element) => (element.tagName.toLowerCase() === tagName.toLowerCase()));
}
