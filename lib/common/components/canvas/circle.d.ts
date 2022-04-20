import { ICanvasArcState } from "../../types/canvas";
import { CanvasChild } from "./child";
export declare class CanvasCircle extends CanvasChild<ICanvasArcState> {
    static get observedAttributes(): string[];
    static DefaultState(): ICanvasArcState;
    constructor();
    paint(ctx: CanvasRenderingContext2D | Path2D): void;
}
export declare function CanvasCircleCompact(): void;
