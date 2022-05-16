"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildProxy = void 0;
const generic_1 = require("./generic");
class ChildProxy extends generic_1.GenericProxy {
    constructor(owner, name, target) {
        super(owner.GetComponentId(), target, name, owner);
    }
}
exports.ChildProxy = ChildProxy;
