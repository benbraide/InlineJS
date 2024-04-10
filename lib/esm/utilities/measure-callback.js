export function MeasureCallback(callback) {
    const start = performance.now();
    callback();
    return (performance.now() - start);
}
