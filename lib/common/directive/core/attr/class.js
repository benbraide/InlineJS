"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassDirectiveHandlerCompact = exports.ClassDirectiveExpansionRule = exports.ClassDirectiveHandler = void 0;
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const get_1 = require("../../../global/get");
const to_string_1 = require("../../../utilities/to-string");
const key_value_1 = require("../../key-value");
exports.ClassDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('class', ({ componentId, contextElement, expression, argKey }) => {
    let split = (key) => key.split(' ').filter(item => !!item), previousList = null;
    let add = (key) => contextElement.classList.add(key), remove = (key) => (contextElement.classList.contains(key) && contextElement.classList.remove(key));
    (0, key_value_1.ResolveKeyValue)({ componentId, contextElement, expression,
        key: argKey.trim(),
        callback: ([key, value]) => split(key).forEach(value ? add : remove),
        arrayCallback: (list) => {
            let validList = list.map(item => (0, to_string_1.ToString)(item)).filter(item => !!item);
            (previousList || []).filter(item => !validList.includes(item)).forEach(remove);
            (previousList ? validList.filter(item => !previousList.includes(item)) : validList).forEach(add);
            previousList = validList;
        },
    });
});
function ClassDirectiveExpansionRule(name) {
    return (name.startsWith('.') ? name.replace('.', (0, get_1.GetGlobal)().GetConfig().GetDirectiveName('class:')) : null);
}
exports.ClassDirectiveExpansionRule = ClassDirectiveExpansionRule;
function ClassDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.ClassDirectiveHandler);
    (0, get_1.GetGlobal)().GetDirectiveManager().AddExpansionRule(ClassDirectiveExpansionRule);
}
exports.ClassDirectiveHandlerCompact = ClassDirectiveHandlerCompact;
