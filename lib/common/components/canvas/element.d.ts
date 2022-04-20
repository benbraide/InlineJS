import { ICanvasCoreState, ICanvasElement, ICanvasPosition, ICanvasShapeState } from "../../types/canvas";
export declare class CanvasElement<T = any> extends HTMLElement implements ICanvasElement {
    protected state_?: T | undefined;
    static DefaultCoreState(): ICanvasCoreState;
    constructor(state_?: T | undefined);
    attributeChangedCallback(name: string, newValue: string, oldValue: string): void;
    IsParent(): boolean;
    ContainsPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): boolean;
    FindElementWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasElement | null;
    GetPosition(): ICanvasPosition;
    OffsetPosition(position: ICanvasPosition): ICanvasPosition;
    Paint(ctx: CanvasRenderingContext2D | Path2D): void;
    protected UpdateState_(key: string, value: any): boolean;
    protected SetPair_(first: string, second: string, both: string, separator?: string): void;
    protected GetPair_(first: string, second: string, both?: string, separator?: string): {
        [x: string]: string;
    };
    protected ForwardAttribute_(names: string | Array<string>, target: HTMLElement): void;
}
export declare class CanvasBlockElement<T = ICanvasShapeState> extends CanvasElement<T> {
    constructor(state?: T, resolveState?: boolean);
    ContainsPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): boolean;
    protected hiddenChanged(): void;
    protected colorChanged(): void;
    protected xChanged(): void;
    protected yChanged(): void;
    protected positionChanged(): void;
    protected SetPosition_(): void;
    protected widthChanged(): void;
    protected heightChanged(): void;
    protected sizeChanged(): void;
    protected SetSize_(): void;
    protected ResolveState_(): void;
}
