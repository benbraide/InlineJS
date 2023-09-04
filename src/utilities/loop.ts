import { JournalTry } from "../journal/try";
import { Loop } from "../values/loop";

export interface ILoopCallbackInfo{
    repeats: number;
    steps: number;
    elapsed: number;
    duration?: number;
    abort?: () => void;
}

type CallbackType = (value: ILoopCallbackInfo) => void;

function CreateLoop_(requestNextLoop: (callback: FrameRequestCallback) => void, delay: number, repeats: number, repeatDelay: number, duration?: number){
    let aborted = false, abort = () => (aborted = true), repeated = 0, computeSteps = (elapsed: number) => (delay ? Math.floor(elapsed / delay) : elapsed);
    let startTimestamp = performance.now(), lastTimestamp = startTimestamp, pass = (doWhile: CallbackType, doFinal: CallbackType, timestamp: DOMHighResTimeStamp) => {
        if (aborted){
            return;
        }

        let elapsed = (timestamp - startTimestamp);
        if (duration && elapsed >= duration){//Finished
            if (repeats && (repeats < 0 || repeated < repeats)){//Repeat
                let offset = (elapsed - duration);
                if (repeatDelay > 0 && offset < repeatDelay){//Continue after delay
                    setTimeout(() => {
                        startTimestamp = performance.now();//Reset start timestamp
                        requestNextLoop(pass.bind(null, doWhile, doFinal));
                    }, (repeatDelay - offset));
                }
                else{//No delay
                    requestNextLoop(pass.bind(null, doWhile, doFinal));
                }

                repeated += 1;//Increment repeats
                startTimestamp = timestamp;//Reset start timestamp
                lastTimestamp = timestamp;//Reset last timestamp
            }
            else{//No repeats
                JournalTry(() => doFinal({ repeats: repeated, steps: (duration ? computeSteps(duration) : -1), elapsed, duration }));
            }
        }
        else{//Continue
            requestNextLoop(pass.bind(null, doWhile, doFinal));

            let progress = (timestamp - lastTimestamp);
            if (progress >= delay){//Call
                lastTimestamp = (timestamp + (delay ? (progress % delay) : progress));//Update last timestamp
                JournalTry(() => doWhile({ repeats: repeated, steps: computeSteps(elapsed), elapsed, duration, abort }));
            }
        }
    };

    return new Loop<ILoopCallbackInfo>((doWhile, doFinal) => {
        requestNextLoop(pass.bind(null, doWhile, doFinal));
    });
}

const knownPeriods = [50, 40, 30, 25, 20, 15, 10, 5, 4, 3, 2, 1, 0];

export function CreateLoop(duration?: number, delay = 1000, repeats = 0, repeatDelay = 0, vsync = true){
    let period = 0, suitableDelay = Math.floor(delay / 2.2);
    for (let knownPeriod of knownPeriods){
        if (knownPeriod <= suitableDelay){
            period = knownPeriod;
            break;
        }
    }
    
    let requestNextLoop = (callback: FrameRequestCallback) => setTimeout(() => {
        vsync ? requestAnimationFrame(callback) : callback(performance.now());
    }, period);

    return CreateLoop_(requestNextLoop, delay, repeats, repeatDelay, duration);
}

export function CreateAnimationLoop(duration?: number, delay = 1000, repeats = 0, repeatDelay = 0){
    return CreateLoop_(requestAnimationFrame, delay, repeats, repeatDelay, duration);
}
