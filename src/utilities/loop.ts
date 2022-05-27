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

export function CreateAnimationLoop(duration?: number, delay = 1000, repeats = 0, repeatDelay = 0){
    let activeDelay = delay;
    let startTimestamp = -1, lastTimestamp = -1, aborted = false, passes = 0, pass = (doWhile: CallbackType, doFinal: CallbackType, timestamp: DOMHighResTimeStamp) => {
        if (aborted){
            return;
        }

        if (startTimestamp == -1){
            startTimestamp = timestamp;
        }

        let elapsed = (timestamp - startTimestamp);
        if (duration && elapsed >= duration){
            if (!repeats){
                return doFinal({ passes, elapsed, duration });
            }

            activeDelay = repeatDelay;
            lastTimestamp = timestamp;
            
            (repeats > 0) && (repeats -= 1);
        }

        if (lastTimestamp == -1){
            lastTimestamp = timestamp;
        }

        let wait = (timestamp - lastTimestamp);
        if (wait >= activeDelay){
            lastTimestamp = (timestamp - (wait - activeDelay));
            activeDelay = delay;
            doWhile({ passes: ++passes, elapsed, duration, abort: () => (aborted = true) });
        }

        requestAnimationFrame(pass.bind(null, doWhile, doFinal));
    };

    return new Loop<ILoopCallbackInfo>((doWhile, doFinal) => {
        requestAnimationFrame(pass.bind(null, doWhile, doFinal));
    });
}
