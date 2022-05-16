"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootProxy = void 0;
const generic_1 = require("./generic");
class RootProxy extends generic_1.GenericProxy {
    constructor(componentId, target) {
        super(componentId, target, `Proxy<${componentId}>`);
    }
}
exports.RootProxy = RootProxy;
