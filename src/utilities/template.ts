export function IsTemplate(element: Element){
    if (element instanceof HTMLTemplateElement){
        return true;
    }

    if ('IsTemplate' in (element as any) && typeof (element as any).IsTemplate === 'function'){
        return !!(element as any).IsTemplate();
    }

    return false;
}

export function IsInsideTemplate(element: Element){
    for (let parent = element.parentNode; parent; parent = parent.parentNode){
        if (parent instanceof Element && IsTemplate(parent)){
            return true;
        }
    }

    return false;
}
