"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetElementScopeId = exports.GetElementScopeIdWithElement = exports.ElementScopeKey = void 0;
exports.ElementScopeKey = '__InlineJS_ELSCOPE_KEY__';
function GetElementScopeIdWithElement(element) {
    const getScopeId = (el) => (((exports.ElementScopeKey in el) && typeof el[exports.ElementScopeKey] === 'string') ? el[exports.ElementScopeKey] : '');
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
exports.GetElementScopeIdWithElement = GetElementScopeIdWithElement;
function GetElementScopeId(element) {
    const [elementScopeId] = GetElementScopeIdWithElement(element);
    return (elementScopeId || '');
}
exports.GetElementScopeId = GetElementScopeId;
