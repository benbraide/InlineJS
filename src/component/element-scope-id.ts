export const ElementScopeKey = '__InlineJS_ELSCOPE_KEY__';

export function GetElementScopeId(element: HTMLElement | null){
    let getScopeId = (el: HTMLElement) => (((ElementScopeKey in el) && typeof el[ElementScopeKey] === 'string') ? el[ElementScopeKey] : ''), scopeId = '';
    while (element){//Get closest element with a scope ID
        scopeId = getScopeId(element);
        if (scopeId || element === document.body){
            return (scopeId || '');
        }

        element = element.parentElement;
    }

    return '';
}
