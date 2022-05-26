"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLoop = void 0;
const loop_1 = require("../values/loop");
function CreateLoop(duration, delay = 1000, repeats = 0, repeatDelay = 0, vsync = true) {
    delay = (delay || 1);
    let totalSteps = (duration ? Math.floor(duration / delay) : -1), steps = 0, aborted = false, checkpoint = 0, call = (steps, doWhile) => {
        if (vsync) { //Use checkpoints to avoid overlapping calls
            let myCheckpoint = ++checkpoint;
            requestAnimationFrame(() => ((myCheckpoint == checkpoint) && doWhile({ passes: steps, elapsed: (steps * delay), duration, abort: () => (aborted = true) })));
        }
        else { //Immediate
            doWhile({ passes: steps, elapsed: (steps * delay), duration, abort: () => (aborted = true) });
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
            call(totalSteps, doWhile);
            (repeats > 0) && (repeats -= 1);
        }
        else { //Step
            setTimeout(step.bind(null, doWhile, doFinal, doAbort), delay);
            call(steps, doWhile);
        }
    };
    return new loop_1.Loop((doWhile, doFinal, doAbort) => {
        setTimeout(step.bind(null, doWhile, doFinal, doAbort), delay);
    });
}
exports.CreateLoop = CreateLoop;
