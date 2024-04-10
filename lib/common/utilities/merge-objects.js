"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeObjects = void 0;
function MergeObjects(target, source) {
    Object.entries(source).forEach(([key, value]) => (!(key in target) && (target[key] = value)));
    return target;
}
exports.MergeObjects = MergeObjects;
