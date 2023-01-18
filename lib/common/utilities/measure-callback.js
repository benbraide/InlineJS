"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasureCallback = void 0;
function MeasureCallback(callback) {
    let start = performance.now();
    callback();
    return (performance.now() - start);
}
exports.MeasureCallback = MeasureCallback;
