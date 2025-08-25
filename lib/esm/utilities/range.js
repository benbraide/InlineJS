import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { IsEqual } from "./is-equal";
import { CreateAnimationLoop } from "./loop";
export function UseRange(range, callback, duration = 3000, delay = 1000) {
    const doLastStep = () => {
        const lastStep = range.Step(1);
        lastStep !== null && JournalTry(() => callback(lastStep));
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
    if (JournalTry(() => callback(previousStep)) === false)
        return;
    CreateAnimationLoop(duration, delay).While(({ elapsed, abort }) => {
        const step = range.Step(elapsed / duration);
        if (step === null) {
            abort === null || abort === void 0 ? void 0 : abort();
        }
        else if (!IsEqual(step, previousStep)) {
            previousStep = step;
            JournalTry(() => callback(step)) === false && (abort === null || abort === void 0 ? void 0 : abort());
        }
    }).Final(doLastStep);
}
