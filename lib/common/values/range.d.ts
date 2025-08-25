export type RangeValueType = number | string | Array<any> | object;
export declare class Range<T extends RangeValueType> {
    protected from_: T;
    protected to_: T;
    constructor(from_: T, to_: T);
    GetFrom(): T;
    GetTo(): T;
    Step(factor: number, offset?: number): T | null;
    IsAscending(): boolean;
}
export declare class TimedRange<T extends RangeValueType> extends Range<T> {
    protected duration_: number;
    protected delay_: number;
    constructor(from: T, to: T, duration_: number, delay_: number);
    GetDuration(): number;
    GetDelay(): number;
}
