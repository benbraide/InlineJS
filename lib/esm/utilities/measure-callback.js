export function MeasureCallback(callback) {
    let start = performance.now();
    callback();
    return (performance.now() - start);
}
