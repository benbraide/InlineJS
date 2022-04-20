import { ICanvasCoreState } from "../../types/canvas";
import { CanvasChild } from "./child";
export declare class CanvasLine extends CanvasChild<ICanvasCoreState> {
    static get observedAttributes(): string[];
    constructor();
    paint(ctx: CanvasRenderingContext2D | Path2D): void;
}
export declare function CanvasLineCompact(): void;
