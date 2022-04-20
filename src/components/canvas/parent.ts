import { JournalTry } from "../../journal/try";
import { ICanvasElement, ICanvasPosition, ICanvasShapeState } from "../../types/canvas";
import { CanvasShape } from "./shape";

export class CanvasParent<T = ICanvasShapeState> extends CanvasShape<T>{
    public static get observedAttributes(){
        return ['x', 'y', 'position', 'mode', 'color'];
    }

    public constructor(state?: T){
        super(state || <T><unknown>CanvasParent.DefaultState());
    }

    public IsParent(){
        return true;
    }

    public FindElementWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasElement | null{
        let filtered = Array.from(this.children).filter(child => (typeof child['FindElementWithPoint'] === 'function'));
        let found = filtered.find(child => (child as any)['FindElementWithPoint'](point, ctx));
        return (found ? <ICanvasElement>(found as any) : null);
    }

    public OffsetPosition(position: ICanvasPosition): ICanvasPosition{
        let myPosition = this.GetPosition();
        if (this.parentElement && 'OffsetPosition' in this.parentElement){
            myPosition = (this.parentElement['OffsetPosition'] as any)(myPosition);
        }
        return { x: (position.x + myPosition.x), y: (position.y + myPosition.y) };
    }

    public paint(ctx: CanvasRenderingContext2D | Path2D){
        return this.PaintWith_(ctx);
    }

    protected PaintWith_(ctx: CanvasRenderingContext2D | Path2D, callback?: () => boolean | void){
        let myPosition = this.GetPosition();
        if (this.parentElement && 'OffsetPosition' in this.parentElement){
            myPosition = (this.parentElement['OffsetPosition'] as any)(myPosition);
        }
        
        ctx.moveTo(myPosition.x, myPosition.y);
        Array.from(this.children).filter(child => (typeof child['Paint'] === 'function')).forEach(child => JournalTry(() => child['Paint'](ctx), 'CanvasParent.Paint'));
        
        if (callback && callback()){
            return;
        }
        
        if ((<unknown>this.state_ as ICanvasShapeState).mode === 'stroke' && 'stroke' in ctx){
            ctx.stroke();
        }
        else if ('fill' in ctx){//Fill
            ctx.fill();
        }
    }
}
