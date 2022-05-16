import { ICanvasElement, ICanvasPosition, ICanvasShapeState } from "../../types/canvas";
import { CanvasShape } from "./shape";
export declare class CanvasParent<T = ICanvasShapeState> extends CanvasShape<T> {
    static get observedAttributes(): string[];
    constructor(state?: T);
    IsParent(): boolean;
    FindElementWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasElement | null;
    OffsetPosition(position: ICanvasPosition): ICanvasPosition;
    paint(ctx: CanvasRenderingContext2D | Path2D): void;
    protected PaintWith_(ctx: CanvasRenderingContext2D | Path2D, callback?: () => boolean | void): void;
}
