"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InferComponent = void 0;
const element_scope_id_1 = require("./element-scope-id");
const find_1 = require("./find");
function InferComponent(element) {
    const matches = (0, element_scope_id_1.GetElementScopeId)(element).match(/^Cmpnt\<([0-9_]+)\>/);
    return (matches ? (0, find_1.FindComponentById)(matches[1]) : null);
}
exports.InferComponent = InferComponent;
