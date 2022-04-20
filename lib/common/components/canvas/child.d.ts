import { ICanvasShapeState } from "../../types/canvas";
import { CanvasShape } from "./shape";
export declare class CanvasChild<T = ICanvasShapeState> extends CanvasShape<T> {
    constructor(state?: T);
    protected Paint_(ctx: CanvasRenderingContext2D): void;
}
