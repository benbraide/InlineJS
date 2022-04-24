import { GetGlobal } from "../../global/get";
import { ICanvasCoreState, ICanvasElement, ICanvasPosition, ICanvasShapeState } from "../../types/canvas";
import { CanvasParent } from "./parent";

export class CanvasPath extends CanvasParent<ICanvasCoreState>{
    private buffer_: Path2D | null = null;
    
    public constructor(){
        super();
    }

    public ContainsPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): boolean{
        if (!this.buffer_){//Create path
            this.buffer_ = new Path2D();
            this.PaintWith_(this.buffer_, () => {
                this.buffer_!.closePath();
                return true;
            });
        }

        return ctx.isPointInPath(this.buffer_, point.x, point.y);
    }

    public FindElementWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasElement | null{
        return (this.ContainsPoint(point, ctx) ? this : null);
    }

    public paint(ctx: CanvasRenderingContext2D | Path2D){
        let doPaint = () => {
            if ((this.state_ && (<unknown>this.state_ as ICanvasShapeState).mode === 'stroke') && 'stroke' in ctx){
                ctx.strokeStyle = ((<unknown>this.state_ as ICanvasShapeState).color || 'black');
                ctx.stroke(this.buffer_!);
            }
            else if ('fill' in ctx){
                ctx.fillStyle = ((<unknown>this.state_ as ICanvasShapeState).color || 'black');
                ctx.fill(this.buffer_!);
            }

            if ('addPath' in ctx){
                ctx.addPath(this.buffer_!);
            }
        }
        
        if (this.buffer_ && 'stroke' in ctx && 'fill' in ctx){
            return doPaint();
        }
        
        this.buffer_ = new Path2D();
        this.PaintWith_(this.buffer_, () => {
            this.buffer_!.closePath();
            doPaint();
            return true;
        });
    }

    protected UpdateState_(key: string, value: any){
        if (super.UpdateState_(key, value)){
            this.buffer_ = null;
            return true;
        }
        return false;
    }
}

export function CanvasPathCompact(){
    customElements.define(GetGlobal().GetConfig().GetDirectiveName('canvas-path'), CanvasPath);
}
