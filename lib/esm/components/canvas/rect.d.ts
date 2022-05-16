import { CanvasShape } from "./shape";
export declare class CanvasRect extends CanvasShape {
    static get observedAttributes(): string[];
    constructor();
    paint(ctx: CanvasRenderingContext2D | Path2D): void;
}
export declare function CanvasRectCompact(): void;
