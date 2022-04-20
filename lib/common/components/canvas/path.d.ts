import { ICanvasCoreState, ICanvasElement, ICanvasPosition } from "../../types/canvas";
import { CanvasParent } from "./parent";
export declare class CanvasPath extends CanvasParent<ICanvasCoreState> {
    private buffer_;
    constructor();
    ContainsPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): boolean;
    FindElementWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasElement | null;
    paint(ctx: CanvasRenderingContext2D | Path2D): void;
    protected UpdateState_(key: string, value: any): boolean;
}
export declare function CanvasPathCompact(): void;
