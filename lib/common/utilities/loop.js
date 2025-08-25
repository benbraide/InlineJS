"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAnimationLoop = exports.CreateLoop = void 0;
const try_1 = require("../journal/try");
const loop_1 = require("../values/loop");
function CreateLoop_(requestNextLoop, delay, repeats, repeatDelay, duration, resolution = 1) {
    let aborted = false, abort = () => (aborted = true), repeated = 0, computeSteps = (elapsed) => (delay ? Math.floor(elapsed / delay) : elapsed);
    let startTimestamp = performance.now(), lastTimestamp = startTimestamp, requests = 0;
    const call = (doWhile, doFinal, doAbort) => {
        requestNextLoop((timestamp) => {
            if (resolution > 1) {
                if (requests++ % resolution === 0) {
                    pass(doWhile, doFinal, doAbort, timestamp);
                }
                else {
                    call(doWhile, doFinal, doAbort);
                }
            }
            else {
                pass(doWhile, doFinal, doAbort, timestamp);
            }
        });
    };
    const pass = (doWhile, doFinal, doAbort, timestamp) => {
        if (aborted) {
            doAbort();
            return;
        }
        const elapsed = (timestamp - startTimestamp);
        if (duration && elapsed >= duration) { //Finished
            if (repeats && (repeats < 0 || repeated < repeats)) { //Repeat
                requests = 0; //Reset requests
                const offset = (elapsed - duration);
                if (repeatDelay > 0 && offset < repeatDelay) { //Continue after delay
                    setTimeout(() => {
                        startTimestamp = performance.now(); //Reset start timestamp
                        call(doWhile, doFinal, doAbort);
                    }, (repeatDelay - offset));
                }
                else { //No delay
                    call(doWhile, doFinal, doAbort);
                }
                repeated += 1; //Increment repeats
                startTimestamp = timestamp; //Reset start timestamp
                lastTimestamp = timestamp; //Reset last timestamp
            }
            else { //No repeats
                (0, try_1.JournalTry)(() => doFinal({ repeats: repeated, steps: (duration ? computeSteps(duration) : -1), elapsed, duration }));
            }
        }
        else { //Continue
            call(doWhile, doFinal, doAbort);
            const progress = (timestamp - lastTimestamp);
            if (progress >= delay) { //Call
                lastTimestamp = (delay ? (timestamp - (progress % delay)) : timestamp); //Update last timestamp
                (0, try_1.JournalTry)(() => doWhile({ repeats: repeated, steps: computeSteps(elapsed), elapsed, duration, abort }));
            }
        }
    };
    return new loop_1.Loop((doWhile, doFinal, doAbort) => call(doWhile, doFinal, doAbort));
}
const knownPeriods = [50, 40, 30, 25, 20, 15, 10, 5, 4, 3, 2, 1, 0];
function CreateLoop(duration, delay = 1000, repeats = 0, repeatDelay = 0, vsync = true, resolution = 1) {
    let period = 0, suitableDelay = Math.floor(delay / 2.2);
    for (const knownPeriod of knownPeriods) {
        if (knownPeriod <= suitableDelay) {
            period = knownPeriod;
            break;
        }
    }
    const requestNextLoop = (callback) => setTimeout(() => {
        vsync ? requestAnimationFrame(callback) : callback(performance.now());
    }, period);
    return CreateLoop_(requestNextLoop, delay, repeats, repeatDelay, duration, resolution);
}
exports.CreateLoop = CreateLoop;
function CreateAnimationLoop(duration, delay = 1000, repeats = 0, repeatDelay = 0, resolution = 1) {
    return CreateLoop_(requestAnimationFrame, delay, repeats, repeatDelay, duration, resolution);
}
exports.CreateAnimationLoop = CreateAnimationLoop;
