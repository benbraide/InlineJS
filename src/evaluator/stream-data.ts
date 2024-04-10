import { Loop } from "../values/loop";
import { WaitPromise } from "./wait-promise";

export function StreamData(data: any, callback: (data: any) => any){
    const wait = (target: any, callback: (data: any) => void) => WaitPromise(target, callback, true);
    if (data instanceof Loop){
        return new Loop((doWhile, doFinal) => {
            data.While((data) => {//For each iteration, wait if applicable, then do while
                wait(data, (data) => {
                    wait(callback(data), (value) => doWhile(value));
                });
            });

            data.Final((data) => {//For each iteration, wait if applicable, then do final
                wait(data, (data) => {
                    wait(callback(data), (value) => doFinal(value));
                });
            });
        });
    }

    if (data instanceof Promise){
        return new Promise<string>((resolve) => {
            wait(data, (data) => {
                wait(callback(data), (value) => resolve(value));
            });
        });
    }

    return callback(data);
}
