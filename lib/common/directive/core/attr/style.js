"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleDirectiveHandlerCompact = exports.StyleDirectiveHandler = void 0;
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const to_string_1 = require("../../../utilities/to-string");
const key_value_1 = require("../../key-value");
const camel_case_1 = require("../../../utilities/camel-case");
exports.StyleDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('style', ({ componentId, contextElement, expression, argKey }) => {
    (0, key_value_1.ResolveKeyValue)({ componentId, contextElement, expression,
        key: argKey.trim(),
        callback: ([key, value]) => {
            key = (0, camel_case_1.ToCamelCase)(key, false, '.');
            if (key in contextElement.style) {
                contextElement.style[key] = (0, to_string_1.ToString)(value);
            }
        },
    });
});
function StyleDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.StyleDirectiveHandler);
}
exports.StyleDirectiveHandlerCompact = StyleDirectiveHandlerCompact;
