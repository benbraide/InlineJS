import { Loop } from "../values/loop";
export function CreateLoop(duration, delay = 1000, repeats = 0, repeatDelay = 0) {
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
    return new Loop((doWhile, doFinal) => {
        requestAnimationFrame(pass.bind(null, doWhile, doFinal));
    });
}