import { CanvasElement } from "./element";
export declare class CanvasSurface extends CanvasElement {
    private ctx_;
    private canvas_;
    private withMouse_;
    private rendered_;
    private queued_;
    static get observedAttributes(): string[];
    constructor();
    Render(): void;
    Refresh(): void;
    protected widthChanged(): void;
    protected heightChanged(): void;
    protected sizeChanged(): void;
    private SetSize_;
}
export declare function CanvasSurfaceCompact(): void;
