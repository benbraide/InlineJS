export function MergeObjects(target: Record<string, any>, source: Record<string, any>) {
    Object.entries(source).forEach(([key, value]) => (!(key in target) && (target[key] = value)));
    return target;
}
