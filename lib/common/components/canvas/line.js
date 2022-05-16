"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasLineCompact = exports.CanvasLine = void 0;
const get_1 = require("../../global/get");
const child_1 = require("./child");
class CanvasLine extends child_1.CanvasChild {
    static get observedAttributes() {
        return ['x', 'y', 'position'];
    }
    constructor() {
        super({
            hidden: true,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
        });
    }
    paint(ctx) {
        let position = this.parentElement.OffsetPosition(this.state_.position);
        ctx.lineTo(position.x, position.y);
    }
}
exports.CanvasLine = CanvasLine;
function CanvasLineCompact() {
    customElements.define((0, get_1.GetGlobal)().GetConfig().GetDirectiveName('canvas-line'), CanvasLine);
}
exports.CanvasLineCompact = CanvasLineCompact;
