import { ICanvasArcState, ICanvasElement, ICanvasPosition } from "../../types/canvas";
import { CanvasBlockElement } from "./element";
export declare class CanvasRoundRect extends CanvasBlockElement<ICanvasArcState> {
    private path_;
    private topLeftArc_;
    private topRightArc_;
    private bottomRightArc_;
    private bottomLeftArc_;
    static get observedAttributes(): string[];
    static DefaultState(): ICanvasArcState;
    constructor();
    FindElementWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasElement | null;
    Paint(ctx: CanvasRenderingContext2D): void;
    protected radiusChanged(): void;
    protected UpdateState_(key: string, value: any): boolean;
}
export declare function CanvasRoundRectCompact(): void;
