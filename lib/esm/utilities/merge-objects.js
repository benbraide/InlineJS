export function MergeObjects(target, source) {
    Object.entries(source).forEach(([key, value]) => (!(key in target) && (target[key] = value)));
    return target;
}
