import { GetGlobal } from "../../global/get";
import { CanvasShape } from "./shape";
export class CanvasRect extends CanvasShape {
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
export function CanvasRectCompact() {
    customElements.define(GetGlobal().GetConfig().GetDirectiveName('canvas-rect'), CanvasRect);
}
