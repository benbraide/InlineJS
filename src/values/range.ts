import { IsObject } from "../utilities/is-object";

export type RangeValueType = number | string | Array<any> | object;

export class Range<T extends RangeValueType> {
    constructor(protected from_: T, protected to_: T){}

    public GetFrom(): T {
        return this.from_;
    }

    public GetTo(): T {
        return this.to_;
    }

    public Step(factor: number, offset: number = 0): T | null {
        const isAscending = this.IsAscending();
        const { start, end } = isAscending ? { start: this.from_, end: this.to_ } : { start: this.to_, end: this.from_ };

        if (typeof this.from_ === 'number' && typeof this.to_ === 'number'){
            // Assumes 'factor' is a ratio (e.g. between 0 and 1) to calculate the intermediate value.
            return (this.from_ + (this.to_ - this.from_) * factor + offset) as T;
        }

        if (typeof start === 'string' && typeof end === 'string'){
            const diffLen = end.length - start.length;
            const count = isAscending ? Math.round(diffLen * factor) : Math.round(diffLen * (1 - factor));
            return (start + end.substring(start.length + offset, start.length + offset + count)) as T;
        }

        if (Array.isArray(start) && Array.isArray(end)){
            const diffLen = end.length - start.length;
            const count = isAscending ? Math.round(diffLen * factor) : Math.round(diffLen * (1 - factor));
            return ([...start, ...end.slice(start.length + offset, start.length + offset + count)]) as T;
        }

        if (IsObject(this.from_) && IsObject(this.to_)){
            const extracted = { ...(start as object) };
            const startKeys = Object.keys(start), endKeys = Object.keys(end);

            const diffLen = endKeys.length - startKeys.length;
            const count = isAscending ? Math.round(diffLen * factor) : Math.round(diffLen * (1 - factor));
            endKeys.slice(startKeys.length + offset, startKeys.length + offset + count).forEach(key => (extracted as Record<string, any>)[key] = (end as Record<string, any>)[key]);
            
            return extracted as T;
        }

        return null;
    }

    public IsAscending(){
        if (typeof this.from_ === 'number' && typeof this.to_ === 'number'){
            return this.from_ < this.to_;
        }

        if (typeof this.from_ === 'string' && typeof this.to_ === 'string'){
            return this.from_.length < this.to_.length;
        }

        if (Array.isArray(this.from_) && Array.isArray(this.to_)){
            return this.from_.length < this.to_.length;
        }

        if (IsObject(this.from_) && IsObject(this.to_)){
            return Object.keys(this.from_).length < Object.keys(this.to_).length;
        }

        return false;
    }
}
