"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassMagicHandlerCompact = exports.ClassMagicHandler = void 0;
const find_1 = require("../../component/find");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
const jit_1 = require("../../proxy/jit");
exports.ClassMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('class', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = (0, jit_1.InitJITProxy)('class', (component || (0, find_1.FindComponentById)(componentId)), contextElement);
    if (proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    let methods = {
        add: (...values) => contextElement.classList.add(...values),
        remove: (...values) => contextElement.classList.remove(...values.filter(value => contextElement.classList.contains(value))),
        toggle: (...values) => values.map(value => contextElement.classList.toggle(value)),
        set: (...values) => (contextElement.className = values.join(' ')),
        contains: (...values) => (values.findIndex(value => !contextElement.classList.contains(value)) == -1),
    };
    return (elementKey ? (scope[elementKey] = (0, create_1.CreateReadonlyProxy)(methods)) : (0, create_1.CreateReadonlyProxy)(methods));
});
function ClassMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.ClassMagicHandler);
}
exports.ClassMagicHandlerCompact = ClassMagicHandlerCompact;
