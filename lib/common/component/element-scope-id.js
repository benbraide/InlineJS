"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetElementScopeId = exports.ElementScopeKey = void 0;
exports.ElementScopeKey = '__InlineJS_ELSCOPE_KEY__';
function GetElementScopeId(element) {
    let getScopeId = (el) => ((exports.ElementScopeKey in el) && el[exports.ElementScopeKey]), scopeId = '';
    while (element) { //Get closest element with a scope ID
        scopeId = getScopeId(element);
        if (scopeId || element === document.body) {
            return (scopeId || '');
        }
        element = element.parentElement;
    }
    return '';
}
exports.GetElementScopeId = GetElementScopeId;
