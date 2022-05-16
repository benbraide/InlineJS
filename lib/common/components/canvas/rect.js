"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasRectCompact = exports.CanvasRect = void 0;
const get_1 = require("../../global/get");
const shape_1 = require("./shape");
class CanvasRect extends shape_1.CanvasShape {
    static get observedAttributes() {
        return ['x', 'y', 'position', 'width', 'height', 'size', 'mode', 'color'];
    }
    constructor() {
        super(CanvasRect.DefaultState());
    }
    paint(ctx) {
        let myState = this.state_, position = this.parentElement.OffsetPosition(myState.position);
        if ('addPath' in ctx) {
            ctx.rect(position.x, position.y, myState.size.width, myState.size.height);
        }
        else if (myState.mode === 'stroke') {
            ctx.strokeRect(position.x, position.y, myState.size.width, myState.size.height);
        }
        else { //Fill
            ctx.fillRect(position.x, position.y, myState.size.width, myState.size.height);
        }
    }
}
exports.CanvasRect = CanvasRect;
function CanvasRectCompact() {
    customElements.define((0, get_1.GetGlobal)().GetConfig().GetDirectiveName('canvas-rect'), CanvasRect);
}
exports.CanvasRectCompact = CanvasRectCompact;
