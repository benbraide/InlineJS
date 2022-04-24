import { GetGlobal } from "../../global/get";
import { ICanvasArcState, ICanvasElement } from "../../types/canvas";
import { CanvasChild } from "./child";

export class CanvasArc extends CanvasChild<ICanvasArcState>{
    public static get observedAttributes(){
        return ['x', 'y', 'position', 'width', 'height', 'size', 'radius', 'mode', 'color'];
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
        super(CanvasArc.DefaultState());
    }

    public paint(ctx: CanvasRenderingContext2D | Path2D){
        let myState = <ICanvasArcState>this.state_, position = (<unknown>this.parentElement as ICanvasElement).OffsetPosition(myState.position);
        ctx.arcTo(position.x, position.y, (position.x + myState.size.width), (position.y + myState.size.height), myState.radius);
    }
}

export function CanvasArcCompact(){
    customElements.define(GetGlobal().GetConfig().GetDirectiveName('canvas-arc'), CanvasArc);
}
