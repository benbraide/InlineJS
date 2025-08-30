import { ICustomElement } from "../types/custom-element";
import { IsCustomElement } from "./is-custom-element";

export function IsTemplate(element: Element){
    if (element instanceof HTMLTemplateElement){
        return true;
    }

    return IsCustomElement(element) && (element as unknown as ICustomElement).IsTemplate();
}

export function IsInsideTemplate(element: Element){
    for (let parent = element.parentNode; parent; parent = parent.parentNode){
        if (parent instanceof Element && IsTemplate(parent)){
            return true;
        }
    }

    return false;
}
