import { Loop } from "../values/loop";
export interface ILoopCallbackInfo {
    passes: number;
    ellapsed: number;
    abort?: () => void;
}
export declare function CreateLoop(duration?: number, delay?: number): Loop<ILoopCallbackInfo>;
