import { Range, RangeValueType } from "../values/range";
export declare function UseRange<T extends RangeValueType>(range: Range<T>, callback: (value: T) => boolean | undefined, duration?: number, delay?: number): void;
