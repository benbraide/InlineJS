import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { Range, RangeValueType, TimedRange } from "../values/range";
import { IsEqual } from "./is-equal";
import { CreateAnimationLoop } from "./loop";

export function UseRange<T extends RangeValueType>(range: Range<T>, callback: (value: T) => boolean | undefined | void, duration: number = 3000, delay = 1000, checkIntegers = true){
    const applyValue = (value: T) => {
        if (!checkIntegers){
            return JournalTry(() => callback(value));
        }

        const from = range.GetFrom(), to = range.GetTo();
        if (typeof from !== "number" || typeof to !== "number"){
            return JournalTry(() => callback(value));
        }

        return JournalTry(() => callback(Number.isInteger(from) && Number.isInteger(to) ? (Math.floor(value as number) as T) : value));
    };
    
    const doLastStep = () => {
        const lastStep = range.Step(1);
        lastStep !== null && applyValue(lastStep);
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
    if (applyValue(previousStep) === false) return;
    
    CreateAnimationLoop(duration, delay).While(({ elapsed, abort }) => {
        const step = range.Step(elapsed / duration);
        if (step === null){
            abort?.();
        }
        else if (!IsEqual(step, previousStep)) {
            previousStep = step;
            applyValue(step) === false && abort?.();
        }
    }).Final(doLastStep);
}

export function ConsiderRange(value: any, callback: (value: any) => boolean | undefined | void, duration: number = 3000, delay = 1000, checkIntegers = true){
    if (GetGlobal().IsRange(value)){
        UseRange(value, callback, duration, delay, checkIntegers);
    }
    else{
        JournalTry(() => callback(value));
    }
}
