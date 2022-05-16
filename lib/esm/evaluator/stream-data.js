import { Loop } from "../values/loop";
import { WaitPromise } from "./wait-promise";
export function StreamData(data, callback) {
    let wait = (target, callback) => WaitPromise(target, callback, true);
    if (data instanceof Loop) {
        return new Loop((doWhile, doFinal) => {
            data.While((data) => {
                wait(data, (data) => {
                    wait(callback(data), (value) => doWhile(value));
                });
            });
            data.Final((data) => {
                wait(data, (data) => {
                    wait(callback(data), (value) => doFinal(value));
                });
            });
        });
    }
    if (data instanceof Promise) {
        return new Promise((resolve) => {
            wait(data, (data) => {
                wait(callback(data), (value) => resolve(value));
            });
        });
    }
    return callback(data);
}
