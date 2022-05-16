"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindDirectiveHandlerCompact = exports.BindDirectiveExpansionRule = exports.BindDirectiveHandler = void 0;
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const get_1 = require("../../../global/get");
const to_string_1 = require("../../../utilities/to-string");
const find_1 = require("../../../component/find");
const key_value_1 = require("../../key-value");
const options_1 = require("../../options");
const camel_case_1 = require("../../../utilities/camel-case");
exports.BindDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('bind', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b;
    argKey = argKey.trim();
    if (argKey === 'key') {
        return (_b = (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.SetKey(expression);
    }
    let options = (0, options_1.ResolveOptions)({ options: { camel: false }, list: argOptions });
    (0, key_value_1.ResolveKeyValue)({ componentId, contextElement, expression,
        key: argKey,
        callback: ([key, value]) => {
            key = (options.camel ? (0, camel_case_1.ToCamelCase)(key) : key);
            let isBoolean = (0, get_1.GetGlobal)().GetConfig().IsBooleanAttribute(key);
            if (value || ((value === 0 || value === '') && !isBoolean)) { //Set
                contextElement.setAttribute(key, (isBoolean ? key : (0, to_string_1.ToString)(value)));
            }
            else { //Remove
                contextElement.removeAttribute(key);
            }
        },
    });
});
function BindDirectiveExpansionRule(name) {
    return (name.startsWith(':') ? ((0, get_1.GetGlobal)().GetConfig().GetDirectiveName('bind') + name) : null);
}
exports.BindDirectiveExpansionRule = BindDirectiveExpansionRule;
function BindDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.BindDirectiveHandler);
    (0, get_1.GetGlobal)().GetDirectiveManager().AddExpansionRule(BindDirectiveExpansionRule);
}
exports.BindDirectiveHandlerCompact = BindDirectiveHandlerCompact;
