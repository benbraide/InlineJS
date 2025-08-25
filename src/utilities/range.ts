import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { Range, RangeValueType, TimedRange } from "../values/range";
import { IsEqual } from "./is-equal";
import { CreateAnimationLoop } from "./loop";

export function UseRange<T extends RangeValueType>(range: Range<T>, callback: (value: T) => boolean | undefined, duration: number = 3000, delay = 1000){
    const doLastStep = () => {
        const lastStep = range.Step(1);
        lastStep !== null && JournalTry(() => callback(lastStep));
    };

    if (GetGlobal().IsTimedRange(range)){
        duration = (range as TimedRange<T>).GetDuration() || duration;
        delay = (range as TimedRange<T>).GetDelay() || delay;
    }
    
    if (duration <= 0){// Duration is invalid
        doLastStep();
        return;
    }
    
    const firstStep = range.Step(0);
    if (firstStep === null){
        doLastStep();
        return;
    }
    
    let previousStep: T = firstStep;
    if (JournalTry(() => callback(previousStep)) === false) return;
    
    CreateAnimationLoop(duration, delay).While(({ elapsed, abort }) => {
        const step = range.Step(elapsed / duration);
        if (step === null){
            abort?.();
        }
        else if (!IsEqual(step, previousStep)) {
            previousStep = step;
            JournalTry(() => callback(step)) === false && abort?.();
        }
    }).Final(doLastStep);
}
