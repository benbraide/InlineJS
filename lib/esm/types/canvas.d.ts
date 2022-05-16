export declare const CanvasRefreshEvent = "canvas.refresh";
export interface ICanvasPosition {
    x: number;
    y: number;
}
export interface ICanvasSize {
    width: number;
    height: number;
}
export declare type ICanvasPaintMode = 'fill' | 'stroke';
export interface ICanvasCoreState {
    hidden: boolean;
    position: ICanvasPosition;
    size: ICanvasSize;
}
export interface ICanvasShapeState extends ICanvasCoreState {
    mode: ICanvasPaintMode;
    color: string;
}
export interface ICanvasPaintRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ICanvasElement {
    IsParent(): boolean;
    ContainsPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): boolean;
    FindElementWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasElement | null;
    GetPosition(): ICanvasPosition;
    OffsetPosition(position: ICanvasPosition): ICanvasPosition;
    Paint(ctx: CanvasRenderingContext2D | Path2D): void;
}
export interface ICanvasArcState extends ICanvasShapeState {
    radius: number;
}
