export interface IJelloAnimationCallbackInfo {
    factor?: number;
    divisor?: number;
    unit?: string;
}
export declare function JelloAnimationCreator({ factor, divisor, unit }?: IJelloAnimationCallbackInfo): ({ fraction, target, stage }: {
    fraction: any;
    target: any;
    stage: any;
}) => void;
