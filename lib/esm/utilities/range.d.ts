import { Range, RangeValueType } from "../values/range";
export declare function UseRange<T extends RangeValueType>(range: Range<T>, callback: (value: T) => boolean | undefined | void, duration?: number, delay?: number, checkIntegers?: boolean): void;
export declare function ConsiderRange(value: any, callback: (value: any) => boolean | undefined | void, duration?: number, delay?: number, checkIntegers?: boolean): void;
