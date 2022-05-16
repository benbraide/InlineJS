export function WaitPromise(value, handler, recursive) {
    if (!(value instanceof Promise)) {
        return handler(value);
    }
    if (recursive) {
        value.then(value => WaitPromise(value, handler, true));
    }
    else { //Wait one
        value.then(handler);
    }
}
