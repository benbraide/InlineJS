import { ICanvasShapeState } from "../../types/canvas";
import { CanvasShape } from "./shape";

export class CanvasChild<T = ICanvasShapeState> extends CanvasShape<T>{
    public constructor(state?: T){
        super(state || <T><unknown>CanvasChild.DefaultState());
    }

    protected Paint_(ctx: CanvasRenderingContext2D){
        if (typeof this['paint'] === 'function'){
            this['paint'](ctx);
        }
    }
}
