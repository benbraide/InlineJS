"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAnimationLoop = exports.CreateLoop = void 0;
const loop_1 = require("../values/loop");
const measure_callback_1 = require("./measure-callback");
function CreateLoop(duration, delay = 1000, repeats = 0, repeatDelay = 0, vsync = true) {
    delay = (delay || 1);
    let delayOffset = 0, totalSteps = (duration ? Math.floor(duration / delay) : -1), steps = 0, aborted = false, checkpoint = 0;
    let call = (steps, doWhile, delay) => {
        let doCall = () => {
            const elapsed = (0, measure_callback_1.MeasureCallback)(() => doWhile({ passes: steps, elapsed: (steps * delay), duration, abort: () => (aborted = true) }));
            if (elapsed > delay) {
                const elapsedSteps = Math.floor((elapsed - delay) / delay); //Compute how many steps were missed
                steps += elapsedSteps; //Add them to the current step
                delayOffset = (elapsed - (Math.floor(elapsed / delay) * delay)); //Compute the offset
            }
        };
        if (vsync) { //Use checkpoints to avoid overlapping calls
            let myCheckpoint = ++checkpoint;
            requestAnimationFrame(() => ((myCheckpoint == checkpoint) && doCall()));
        }
        else { //Immediate
            doCall();
        }
    };
    let step = (doWhile, doFinal, doAbort) => {
        if (aborted) {
            return doAbort();
        }
        steps += 1;
        if (totalSteps >= 0 && steps >= totalSteps) {
            if (!repeats) { //No repeats
                return doFinal({ passes: totalSteps, elapsed: (totalSteps * delay), duration });
            }
            setTimeout(() => setTimeout(step.bind(null, doWhile, doFinal, doAbort), delay), repeatDelay);
            delayOffset = 0;
            call(totalSteps, doWhile, repeatDelay);
            (repeats > 0) && (repeats -= 1);
        }
        else { //Step
            setTimeout(step.bind(null, doWhile, doFinal, doAbort), (delay - delayOffset));
            delayOffset = 0;
            call(steps, doWhile, delay);
        }
    };
    return new loop_1.Loop((doWhile, doFinal, doAbort) => {
        setTimeout(step.bind(null, doWhile, doFinal, doAbort), delay);
    });
}
exports.CreateLoop = CreateLoop;
function CreateAnimationLoop(duration, delay = 1000, repeats = 0, repeatDelay = 0) {
    let activeDelay = delay;
    let startTimestamp = -1, lastTimestamp = -1, aborted = false, passes = 0, pass = (doWhile, doFinal, timestamp) => {
        if (aborted) {
            return;
        }
        if (startTimestamp == -1) {
            startTimestamp = timestamp;
        }
        let elapsed = (timestamp - startTimestamp);
        if (duration && elapsed >= duration) {
            if (!repeats) {
                return doFinal({ passes, elapsed, duration });
            }
            activeDelay = repeatDelay;
            lastTimestamp = timestamp;
            (repeats > 0) && (repeats -= 1);
        }
        if (lastTimestamp == -1) {
            lastTimestamp = timestamp;
        }
        let wait = (timestamp - lastTimestamp);
        if (wait >= activeDelay) {
            lastTimestamp = (timestamp - (wait - activeDelay));
            activeDelay = delay;
            doWhile({ passes: ++passes, elapsed, duration, abort: () => (aborted = true) });
        }
        requestAnimationFrame(pass.bind(null, doWhile, doFinal));
    };
    return new loop_1.Loop((doWhile, doFinal) => {
        requestAnimationFrame(pass.bind(null, doWhile, doFinal));
    });
}
exports.CreateAnimationLoop = CreateAnimationLoop;
