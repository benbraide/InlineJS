import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { IsEqual } from "./is-equal";
import { CreateAnimationLoop } from "./loop";
export function UseRange(range, callback, duration = 3000, delay = 1000, checkIntegers = true) {
    const applyValue = (value) => {
        if (!checkIntegers) {
            return JournalTry(() => callback(value));
        }
        const from = range.GetFrom(), to = range.GetTo();
        if (typeof from !== "number" || typeof to !== "number") {
            return JournalTry(() => callback(value));
        }
        return JournalTry(() => callback(Number.isInteger(from) && Number.isInteger(to) ? Math.floor(value) : value));
    };
    const doLastStep = () => {
        const lastStep = range.Step(1);
        lastStep !== null && applyValue(lastStep);
    };
    if (GetGlobal().IsTimedRange(range)) {
        duration = range.GetDuration() || duration;
        delay = range.GetDelay() || delay;
    }
    if (duration <= 0) { // Duration is invalid
        doLastStep();
        return;
    }
    const firstStep = range.Step(0);
    if (firstStep === null) {
        doLastStep();
        return;
    }
    let previousStep = firstStep;
    if (applyValue(previousStep) === false)
        return;
    CreateAnimationLoop(duration, delay).While(({ elapsed, abort }) => {
        const step = range.Step(elapsed / duration);
        if (step === null) {
            abort === null || abort === void 0 ? void 0 : abort();
        }
        else if (!IsEqual(step, previousStep)) {
            previousStep = step;
            applyValue(step) === false && (abort === null || abort === void 0 ? void 0 : abort());
        }
    }).Final(doLastStep);
}
export function ConsiderRange(value, callback, duration = 3000, delay = 1000, checkIntegers = true) {
    if (GetGlobal().IsRange(value)) {
        UseRange(value, callback, duration, delay, checkIntegers);
    }
    else {
        JournalTry(() => callback(value));
    }
}
