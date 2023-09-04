import { Loop } from "../values/loop";
export interface ILoopCallbackInfo {
    repeats: number;
    steps: number;
    elapsed: number;
    duration?: number;
    abort?: () => void;
}
export declare function CreateLoop(duration?: number, delay?: number, repeats?: number, repeatDelay?: number, vsync?: boolean): Loop<ILoopCallbackInfo>;
export declare function CreateAnimationLoop(duration?: number, delay?: number, repeats?: number, repeatDelay?: number): Loop<ILoopCallbackInfo>;
