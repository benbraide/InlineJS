import { GetOrCreateGlobal } from "../../global/create";
import { ICanvasArcState, ICanvasElement } from "../../types/canvas";
import { CanvasChild } from "./child";

export class CanvasCircle extends CanvasChild<ICanvasArcState>{
    public static get observedAttributes(){
        return ['x', 'y', 'position', 'radius', 'mode', 'color'];
    }

    public static DefaultState(): ICanvasArcState{
        return {
            hidden: true,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
            mode: 'fill',
            color: '',
            radius: 0,
        };
    }

    public constructor(){
        super(CanvasCircle.DefaultState());
    }

    public paint(ctx: CanvasRenderingContext2D | Path2D){
        let myState = <ICanvasArcState>this.state_, position = (<unknown>this.parentElement as ICanvasElement).OffsetPosition(myState.position);
        ctx.arc((position.x + myState.radius), (position.y + myState.radius), myState.radius, 0, (Math.PI * 2), false);
    }
}

export function CanvasCircleCompact(){
    customElements.define(GetOrCreateGlobal().GetConfig().GetDirectiveName('canvas-circle'), CanvasCircle);
}
