import { CanvasRefreshEvent, ICanvasShapeState } from "../../types/canvas";
import { CanvasBlockElement } from "./element";

export class CanvasShape<T = ICanvasShapeState> extends CanvasBlockElement<T>{
    public static DefaultState(): ICanvasShapeState{
        return {
            hidden: true,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
            mode: 'fill',
            color: '',
        };
    }
    
    public constructor(state?: T){
        super(state);
    }

    public Paint(ctx: CanvasRenderingContext2D | Path2D){
        if (!this.state_ || !this.state_['hidden']){
            this.Paint_(ctx);
        }
    }

    protected Paint_(ctx: CanvasRenderingContext2D | Path2D){
        if (typeof this['paint'] === 'function'){
            if (this.state_ && (<unknown>this.state_ as ICanvasShapeState).mode === 'stroke' && 'strokeStyle' in ctx){
                ctx.strokeStyle = ((<unknown>this.state_ as ICanvasShapeState).color || 'black');
            }
            else if ('fillStyle' in ctx){
                ctx.fillStyle = ((<unknown>this.state_ as ICanvasShapeState).color || 'black');
            }
            
            this['paint'](ctx);
        }
    }

    protected UpdateState_(key: string, value: any){
        if (!super.UpdateState_(key, value)){//No changes
            return false;
        }

        this.dispatchEvent(new CustomEvent(CanvasRefreshEvent, {
            bubbles: true,
        }));

        return true;
    }
}
