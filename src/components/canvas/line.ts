import { GetOrCreateGlobal } from "../../global/create";
import { ICanvasCoreState, ICanvasElement } from "../../types/canvas";
import { CanvasChild } from "./child";

export class CanvasLine extends CanvasChild<ICanvasCoreState>{
    public static get observedAttributes() {
        return ['x', 'y', 'position'];
    }

    public constructor(){
        super({
            hidden: true,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
        });
    }

    public paint(ctx: CanvasRenderingContext2D | Path2D){
        let position = (<unknown>this.parentElement as ICanvasElement).OffsetPosition((this.state_ as ICanvasCoreState).position);
        ctx.lineTo(position.x, position.y);
    }
}

export function CanvasLineCompact(){
    customElements.define(GetOrCreateGlobal().GetConfig().GetDirectiveName('canvas-line'), CanvasLine);
}
