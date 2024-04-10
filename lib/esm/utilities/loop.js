import { JournalTry } from "../journal/try";
import { Loop } from "../values/loop";
function CreateLoop_(requestNextLoop, delay, repeats, repeatDelay, duration) {
    let aborted = false, abort = () => (aborted = true), repeated = 0, computeSteps = (elapsed) => (delay ? Math.floor(elapsed / delay) : elapsed);
    let startTimestamp = performance.now(), lastTimestamp = startTimestamp, pass = (doWhile, doFinal, timestamp) => {
        if (aborted) {
            return;
        }
        const elapsed = (timestamp - startTimestamp);
        if (duration && elapsed >= duration) { //Finished
            if (repeats && (repeats < 0 || repeated < repeats)) { //Repeat
                const offset = (elapsed - duration);
                if (repeatDelay > 0 && offset < repeatDelay) { //Continue after delay
                    setTimeout(() => {
                        startTimestamp = performance.now(); //Reset start timestamp
                        requestNextLoop(pass.bind(null, doWhile, doFinal));
                    }, (repeatDelay - offset));
                }
                else { //No delay
                    requestNextLoop(pass.bind(null, doWhile, doFinal));
                }
                repeated += 1; //Increment repeats
                startTimestamp = timestamp; //Reset start timestamp
                lastTimestamp = timestamp; //Reset last timestamp
            }
            else { //No repeats
                JournalTry(() => doFinal({ repeats: repeated, steps: (duration ? computeSteps(duration) : -1), elapsed, duration }));
            }
        }
        else { //Continue
            requestNextLoop(pass.bind(null, doWhile, doFinal));
            const progress = (timestamp - lastTimestamp);
            if (progress >= delay) { //Call
                lastTimestamp = (timestamp + (delay ? (progress % delay) : progress)); //Update last timestamp
                JournalTry(() => doWhile({ repeats: repeated, steps: computeSteps(elapsed), elapsed, duration, abort }));
            }
        }
    };
    return new Loop((doWhile, doFinal) => {
        requestNextLoop(pass.bind(null, doWhile, doFinal));
    });
}
const knownPeriods = [50, 40, 30, 25, 20, 15, 10, 5, 4, 3, 2, 1, 0];
export function CreateLoop(duration, delay = 1000, repeats = 0, repeatDelay = 0, vsync = true) {
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
    return CreateLoop_(requestNextLoop, delay, repeats, repeatDelay, duration);
}
export function CreateAnimationLoop(duration, delay = 1000, repeats = 0, repeatDelay = 0) {
    return CreateLoop_(requestAnimationFrame, delay, repeats, repeatDelay, duration);
}
