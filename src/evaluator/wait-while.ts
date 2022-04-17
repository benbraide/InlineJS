import { Loop } from "../values/loop";

export function WaitWhile(value: any, handler: (value: any) => void, finalHandler?: ((value: any) => void) | false){
    if (value instanceof Loop){
        value.While(handler).Final((finalHandler === false) ? () => {} : (finalHandler || handler));
    }
    else{
        handler(value);
    }
}
