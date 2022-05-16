import { ICanvasShapeState } from "../../types/canvas";
import { CanvasBlockElement } from "./element";
export declare class CanvasShape<T = ICanvasShapeState> extends CanvasBlockElement<T> {
    static DefaultState(): ICanvasShapeState;
    constructor(state?: T);
    Paint(ctx: CanvasRenderingContext2D | Path2D): void;
    protected Paint_(ctx: CanvasRenderingContext2D | Path2D): void;
    protected UpdateState_(key: string, value: any): boolean;
}
