import { GetGlobal } from "../../global/get";
import { CanvasChild } from "./child";
export class CanvasLine extends CanvasChild {
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
export function CanvasLineCompact() {
    customElements.define(GetGlobal().GetConfig().GetDirectiveName('canvas-line'), CanvasLine);
}
