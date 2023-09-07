export function FindAncestor<T = HTMLElement>(target: HTMLElement, predicate: (element: HTMLElement) => boolean){
    for (let ancestor = target.parentNode; ancestor; ancestor = ancestor.parentNode){
        try{
            if ((ancestor instanceof HTMLElement) && predicate(ancestor)){
                return (ancestor as unknown as T);
            }
        }
        catch{
            break;
        }
    }

    return null;
}

export function FindAncestorByClass<T = HTMLElement>(target: HTMLElement, className: string){
    return FindAncestor<T>(target, (element) => element.classList.contains(className));
}

export function FindAncestorByAttribute<T = HTMLElement>(target: HTMLElement, attributeName: string){
    return FindAncestor<T>(target, (element) => element.hasAttribute(attributeName));
}

export function FindAncestorByAttributeValue<T = HTMLElement>(target: HTMLElement, attributeName: string, value: string){
    return FindAncestor<T>(target, (element) => (element.getAttribute(attributeName) === value));
}

export function FindAncestorByTagName<T = HTMLElement>(target: HTMLElement, tagName: string){
    return FindAncestor<T>(target, (element) => (element.tagName.toLowerCase() === tagName.toLowerCase()));
}
