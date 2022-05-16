import { GetGlobal } from "../../global/get";
import { CanvasChild } from "./child";
export class CanvasCircle extends CanvasChild {
    static get observedAttributes() {
        return ['x', 'y', 'position', 'radius', 'mode', 'color'];
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
        super(CanvasCircle.DefaultState());
    }
    paint(ctx) {
        let myState = this.state_, position = this.parentElement.OffsetPosition(myState.position);
        ctx.arc((position.x + myState.radius), (position.y + myState.radius), myState.radius, 0, (Math.PI * 2), false);
    }
}
export function CanvasCircleCompact() {
    customElements.define(GetGlobal().GetConfig().GetDirectiveName('canvas-circle'), CanvasCircle);
}
