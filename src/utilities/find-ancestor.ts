export function FindAncestor(target: HTMLElement, predicate: (element: HTMLElement) => boolean){
    for (let ancestor = target.parentNode; ancestor; ancestor = ancestor.parentNode){
        try{
            if ((ancestor instanceof HTMLElement) && predicate(ancestor)){
                return ancestor;
            }
        }
        catch{
            break;
        }
    }

    return null;
}

export function FindAncestorByClass(target: HTMLElement, className: string){
    return FindAncestor(target, (element) => element.classList.contains(className));
}

export function FindAncestorByAttribute(target: HTMLElement, attributeName: string){
    return FindAncestor(target, (element) => element.hasAttribute(attributeName));
}

export function FindAncestorByAttributeValue(target: HTMLElement, attributeName: string, value: string){
    return FindAncestor(target, (element) => (element.getAttribute(attributeName) === value));
}

export function FindAncestorByTagName(target: HTMLElement, tagName: string){
    return FindAncestor(target, (element) => (element.tagName.toLowerCase() === tagName.toLowerCase()));
}
