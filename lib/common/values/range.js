"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = void 0;
const is_object_1 = require("../utilities/is-object");
class Range {
    constructor(from_, to_) {
        this.from_ = from_;
        this.to_ = to_;
    }
    GetFrom() {
        return this.from_;
    }
    GetTo() {
        return this.to_;
    }
    Step(factor, offset = 0) {
        const isAscending = this.IsAscending();
        const { start, end } = isAscending ? { start: this.from_, end: this.to_ } : { start: this.to_, end: this.from_ };
        if (typeof this.from_ === 'number' && typeof this.to_ === 'number') {
            // Assumes 'factor' is a ratio (e.g. between 0 and 1) to calculate the intermediate value.
            return (this.from_ + (this.to_ - this.from_) * factor + offset);
        }
        if (typeof start === 'string' && typeof end === 'string') {
            const diffLen = end.length - start.length;
            const count = isAscending ? Math.round(diffLen * factor) : Math.round(diffLen * (1 - factor));
            return (start + end.substring(start.length + offset, start.length + offset + count));
        }
        if (Array.isArray(start) && Array.isArray(end)) {
            const diffLen = end.length - start.length;
            const count = isAscending ? Math.round(diffLen * factor) : Math.round(diffLen * (1 - factor));
            return ([...start, ...end.slice(start.length + offset, start.length + offset + count)]);
        }
        if ((0, is_object_1.IsObject)(this.from_) && (0, is_object_1.IsObject)(this.to_)) {
            const extracted = Object.assign({}, start);
            const startKeys = Object.keys(start), endKeys = Object.keys(end);
            const diffLen = endKeys.length - startKeys.length;
            const count = isAscending ? Math.round(diffLen * factor) : Math.round(diffLen * (1 - factor));
            endKeys.slice(startKeys.length + offset, startKeys.length + offset + count).forEach(key => extracted[key] = end[key]);
            return extracted;
        }
        return null;
    }
    IsAscending() {
        if (typeof this.from_ === 'number' && typeof this.to_ === 'number') {
            return this.from_ < this.to_;
        }
        if (typeof this.from_ === 'string' && typeof this.to_ === 'string') {
            return this.from_.length < this.to_.length;
        }
        if (Array.isArray(this.from_) && Array.isArray(this.to_)) {
            return this.from_.length < this.to_.length;
        }
        if ((0, is_object_1.IsObject)(this.from_) && (0, is_object_1.IsObject)(this.to_)) {
            return Object.keys(this.from_).length < Object.keys(this.to_).length;
        }
        return false;
    }
}
exports.Range = Range;
