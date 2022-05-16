import { Loop } from "../values/loop";
export function WaitWhile(value, handler, finalHandler) {
    if (value instanceof Loop) {
        value.While(handler).Final((finalHandler === false) ? () => { } : (finalHandler || handler));
    }
    else {
        handler(value);
    }
}
