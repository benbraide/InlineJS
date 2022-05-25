import { Loop } from "../values/loop";
export function CreateLoop(duration, delay = 1000, repeats = 0, repeatDelay = 0) {
    delay = (delay || 1);
    let totalSteps = (duration ? Math.floor(duration / delay) : -1), steps = 0, waitingRepeat = false;
    let startTimestamp = -1, aborted = false, step = (doWhile, doFinal, doAbort, timestamp) => {
        if (aborted) {
            return doAbort();
        }
        if (waitingRepeat) {
            if ((timestamp - startTimestamp) >= repeatDelay) { //Wait complete
                waitingRepeat = false;
                startTimestamp = -1;
                steps = 0;
            }
            return requestAnimationFrame(step.bind(null, doWhile, doFinal, doAbort));
        }
        if (startTimestamp == -1) { //First entry
            startTimestamp = timestamp;
            return requestAnimationFrame(step.bind(null, doWhile, doFinal, doAbort));
        }
        let computedSteps = Math.floor((timestamp - startTimestamp) / delay);
        if (totalSteps != -1 && computedSteps >= totalSteps) {
            if (!repeats) { //No repeats
                return doFinal({ passes: totalSteps, elapsed: (timestamp - startTimestamp), duration });
            }
            doWhile({ passes: totalSteps, elapsed: (timestamp - startTimestamp), duration, abort: () => (aborted = true) });
            waitingRepeat = true;
            startTimestamp = timestamp;
            (repeats > 0) && (repeats -= 1);
        }
        else if (computedSteps != steps) {
            doWhile({ passes: (steps = computedSteps), elapsed: (timestamp - startTimestamp), duration, abort: () => (aborted = true) });
        }
        requestAnimationFrame(step.bind(null, doWhile, doFinal, doAbort));
    };
    return new Loop((doWhile, doFinal, doAbort) => {
        requestAnimationFrame(step.bind(null, doWhile, doFinal, doAbort));
    });
}
