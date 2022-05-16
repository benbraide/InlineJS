"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamData = void 0;
const loop_1 = require("../values/loop");
const wait_promise_1 = require("./wait-promise");
function StreamData(data, callback) {
    let wait = (target, callback) => (0, wait_promise_1.WaitPromise)(target, callback, true);
    if (data instanceof loop_1.Loop) {
        return new loop_1.Loop((doWhile, doFinal) => {
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
exports.StreamData = StreamData;
