"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasArcCompact = exports.CanvasArc = void 0;
const get_1 = require("../../global/get");
const child_1 = require("./child");
class CanvasArc extends child_1.CanvasChild {
    static get observedAttributes() {
        return ['x', 'y', 'position', 'width', 'height', 'size', 'radius', 'mode', 'color'];
    }
    static DefaultState() {
        return {
            hidden: true,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
            mode: 'fill',
            color: '',
            radius: 0,
        };
    }
    constructor() {
        super(CanvasArc.DefaultState());
    }
    paint(ctx) {
        let myState = this.state_, position = this.parentElement.OffsetPosition(myState.position);
        ctx.arcTo(position.x, position.y, (position.x + myState.size.width), (position.y + myState.size.height), myState.radius);
    }
}
exports.CanvasArc = CanvasArc;
function CanvasArcCompact() {
    customElements.define((0, get_1.GetGlobal)().GetConfig().GetDirectiveName('canvas-arc'), CanvasArc);
}
exports.CanvasArcCompact = CanvasArcCompact;
