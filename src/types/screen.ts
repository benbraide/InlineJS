export interface IScreenPoint<T>{
    x: T;
    y: T;
}

export interface IScreenOrientation<T>{
    horizontal: T;
    vertical: T;
}

export interface IScreenSize{
    width: number;
    height: number;
}

export interface IScreenScrollParams{
    to: IScreenPoint<number | null>;
    from?: IScreenPoint<number | null>;
    animate?: boolean;
}

export type ScreenSizeMarksType = [string, number];

export interface IScreenConcept{
    StopListening(): void;
    Scroll(params: IScreenScrollParams): void;
    ScrollTop(animate?: boolean): void;
    ScrollRight(animate?: boolean): void;
    ScrollBottom(animate?: boolean): void;
    ScrollLeft(animate?: boolean): void;
    GetScrollOffset(): IScreenPoint<number>;
    GetScrollPercentage(): IScreenPoint<number>;
    GetScrollTrend(): IScreenOrientation<-1 | 0 | 1>;
    GetScrollStreak(): IScreenOrientation<number>;
    GetSize(): IScreenSize;
    GetSizeMarks(): ScreenSizeMarksType;
    GetBreakpoint(): string;
    GetCheckpoint(): number;
}
