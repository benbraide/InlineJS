export function MeasureCallback(callback: () => void){
    const start = performance.now();
    callback();
    return (performance.now() - start);
}
