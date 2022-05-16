"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasChild = void 0;
const shape_1 = require("./shape");
class CanvasChild extends shape_1.CanvasShape {
    constructor(state) {
        super(state || CanvasChild.DefaultState());
    }
    Paint_(ctx) {
        if (typeof this['paint'] === 'function') {
            this['paint'](ctx);
        }
    }
}
exports.CanvasChild = CanvasChild;
