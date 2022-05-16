import { IComponent } from "../types/component";
import { IScreenConcept, IScreenPoint, IScreenScrollParams, IScreenSize, ScreenSizeMarksType } from "../types/screen";
export declare class ScreenConcept implements IScreenConcept {
    private component_?;
    private sizeMarkList_?;
    private id_;
    private size_;
    private scrollOffset_;
    private scrollTrend_;
    private scrollStreak_;
    private listeners_;
    constructor(component_?: IComponent | undefined, sizeMarkList_?: ScreenSizeMarksType[] | undefined);
    StopListening(): void;
    Scroll({ to, from, animate }: IScreenScrollParams): void;
    ScrollTop(animate?: boolean): void;
    ScrollRight(animate?: boolean): void;
    ScrollBottom(animate?: boolean): void;
    ScrollLeft(animate?: boolean): void;
    GetScrollOffset(): {
        x: number;
        y: number;
    };
    GetScrollPercentage(): IScreenPoint<number>;
    GetScrollTrend(): {
        horizontal: 0 | 1 | -1;
        vertical: 0 | 1 | -1;
    };
    GetScrollStreak(): {
        horizontal: number;
        vertical: number;
    };
    GetSize(): IScreenSize;
    GetSizeMarks(): [string, number];
    GetBreakpoint(): string;
    GetCheckpoint(): number;
    private HandleResize_;
    private HandleScroll_;
    private FindSizeMarks_;
    static GetScrollOffset(): IScreenPoint<number>;
    static ComputeScrollPercentage({ x, y }: IScreenPoint<number>): IScreenPoint<number>;
}
