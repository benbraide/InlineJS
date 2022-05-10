import { Loop } from "../values/loop";

export interface ILoopCallbackInfo{
    passes: number;
    elapsed: number;
    duration?: number;
    abort?: () => void;
}

type CallbackType = (value: ILoopCallbackInfo) => void;

export function CreateLoop(duration?: number, delay = 1000){
    let startTimestamp = -1, lastTimestamp = -1, aborted = false, passes = 0, pass = (doWhile: CallbackType, doFinal: CallbackType, timestamp: DOMHighResTimeStamp) => {
        if (aborted){
            return;
        }

        if (startTimestamp == -1){
            startTimestamp = timestamp;
        }

        let elapsed = (timestamp - startTimestamp);
        if (duration && elapsed >= duration){
            return doFinal({ passes, elapsed, duration });
        }

        if (lastTimestamp == -1){
            lastTimestamp = timestamp;
        }

        let wait = (timestamp - lastTimestamp);
        if (wait >= delay){
            lastTimestamp = (timestamp - (wait - delay));
            doWhile({ passes: ++passes, elapsed, duration, abort: () => (aborted = true) });
        }

        requestAnimationFrame(pass.bind(null, doWhile, doFinal));
    };

    return new Loop<ILoopCallbackInfo>((doWhile, doFinal) => {
        requestAnimationFrame(pass.bind(null, doWhile, doFinal));
    });
}
