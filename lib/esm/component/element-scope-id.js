export const ElementScopeKey = '__InlineJS_ELSCOPE_KEY__';
export function GetElementScopeIdWithElement(element) {
    const getScopeId = (el) => (((ElementScopeKey in el) && typeof el[ElementScopeKey] === 'string') ? el[ElementScopeKey] : '');
    while (element) { //Get closest element with a scope ID
        const scopeId = getScopeId(element);
        if (scopeId) {
            return [scopeId, element];
        }
        if (element === document.body) {
            return [null, null];
        }
        element = element.parentElement;
    }
    return [null, null];
}
export function GetElementScopeId(element) {
    const [elementScopeId] = GetElementScopeIdWithElement(element);
    return (elementScopeId || '');
}
