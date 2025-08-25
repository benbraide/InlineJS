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
