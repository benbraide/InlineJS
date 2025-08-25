import { JournalTry } from "../journal/try";
import { Range, RangeValueType } from "../values/range";
import { IsEqual } from "./is-equal";
import { CreateAnimationLoop } from "./loop";

export function UseRange<T extends RangeValueType>(range: Range<T>, callback: (value: T) => boolean, duration: number = 1000){
    const doLastStep = () => {
        const lastStep = range.Step(1);
        lastStep !== null && JournalTry(() => callback(lastStep));
    };
    
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
    JournalTry(() => callback(previousStep));
    
    CreateAnimationLoop(duration).While(({ elapsed, abort }) => {
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
