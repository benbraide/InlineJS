export function MeasureCallback(callback: () => void){
    let start = performance.now();
    callback();
    return (performance.now() - start);
}
