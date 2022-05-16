export interface IRubberbandAnimationCallbackInfo {
    factor?: number;
    multiplier?: number;
}
export declare function RubberbandAnimationCreator({ factor, multiplier }?: IRubberbandAnimationCallbackInfo): ({ fraction, target, stage }: {
    fraction: any;
    target: any;
    stage: any;
}) => void;
