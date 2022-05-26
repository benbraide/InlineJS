import { Loop } from "../values/loop";

export interface ILoopCallbackInfo{
    passes: number;
    elapsed: number;
    duration?: number;
    abort?: () => void;
}

type CallbackType = (value: ILoopCallbackInfo) => void;

export function CreateLoop(duration?: number, delay = 1000, repeats = 0, repeatDelay = 0, vsync = true){
    delay = (delay || 1);
    let totalSteps = (duration ? Math.floor(duration / delay) : -1), steps = 0, aborted = false, checkpoint = 0, call = (steps: number, doWhile: CallbackType) => {
        if (vsync){//Use checkpoints to avoid overlapping calls
            let myCheckpoint = ++checkpoint;
            requestAnimationFrame(() => ((myCheckpoint == checkpoint) && doWhile({ passes: steps, elapsed: (steps * delay), duration, abort: () => (aborted = true) })));
        }
        else{//Immediate
            doWhile({ passes: steps, elapsed: (steps * delay), duration, abort: () => (aborted = true) });
        }
    };

    let step = (doWhile: CallbackType, doFinal: CallbackType, doAbort: () => void) => {
        if (aborted){
            return doAbort();
        }

        steps += 1;
        if (totalSteps >= 0 && steps >= totalSteps){
            if (!repeats){//No repeats
                return doFinal({ passes: totalSteps, elapsed: (totalSteps * delay), duration });
            }

            setTimeout(() => setTimeout(step.bind(null, doWhile, doFinal, doAbort), delay), repeatDelay);
            call(totalSteps, doWhile);

            (repeats > 0) && (repeats -= 1);
        }
        else{//Step
            setTimeout(step.bind(null, doWhile, doFinal, doAbort), delay);
            call(steps, doWhile);
        }
    };

    return new Loop<ILoopCallbackInfo>((doWhile, doFinal, doAbort) => {
        setTimeout(step.bind(null, doWhile, doFinal, doAbort), delay);
    });
}
