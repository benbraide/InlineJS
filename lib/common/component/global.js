"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryGlobalComponent = void 0;
const get_1 = require("../global/get");
const InlineJSGlobalComponentKey = '__InlineJS_GLOBAL_COMPONENT_KEY__';
function QueryGlobalComponent(create) {
    let info = globalThis[InlineJSGlobalComponentKey];
    if (info || create === false) {
        return info.component;
    }
    let root = document.createElement('template');
    globalThis[InlineJSGlobalComponentKey] = { root,
        component: (0, get_1.GetGlobal)().CreateComponent(root),
    };
    return globalThis[InlineJSGlobalComponentKey];
}
exports.QueryGlobalComponent = QueryGlobalComponent;
