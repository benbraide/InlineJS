import { GetGlobal } from "../../global/get";
import { ICanvasElement, ICanvasShapeState } from "../../types/canvas";
import { CanvasShape } from "./shape";

export class CanvasRect extends CanvasShape{
    public static get observedAttributes(){
        return ['x', 'y', 'position', 'width', 'height', 'size', 'mode', 'color'];
    }

    public constructor(){
        super(CanvasRect.DefaultState());
    }

    public paint(ctx: CanvasRenderingContext2D | Path2D){
        let myState = <ICanvasShapeState>this.state_, position = (<unknown>this.parentElement as ICanvasElement).OffsetPosition(myState.position);
        if ('addPath' in ctx){
            ctx.rect(position.x, position.y, myState.size.width, myState.size.height);
        }
        else if (myState.mode === 'stroke'){
            (ctx as CanvasRenderingContext2D).strokeRect(position.x, position.y, myState.size.width, myState.size.height);
        }
        else{//Fill
            (ctx as CanvasRenderingContext2D).fillRect(position.x, position.y, myState.size.width, myState.size.height);
        }
    }
}

export function CanvasRectCompact(){
    customElements.define(GetGlobal().GetConfig().GetDirectiveName('canvas-rect'), CanvasRect);
}
