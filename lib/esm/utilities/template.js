import { IsCustomElement } from "./is-custom-element";
export function IsTemplate(element) {
    if (element instanceof HTMLTemplateElement) {
        return true;
    }
    return IsCustomElement(element) && element.IsTemplate();
}
export function IsInsideTemplate(element) {
    for (let parent = element.parentNode; parent; parent = parent.parentNode) {
        if (parent instanceof Element && IsTemplate(parent)) {
            return true;
        }
    }
    return false;
}
