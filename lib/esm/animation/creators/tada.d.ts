export interface ITadaAnimationCallbackInfo {
    displacement?: number;
    fromFactor?: number;
    toFactor?: number;
    unit?: string;
}
export declare function TadaAnimationCreator({ displacement, fromFactor, toFactor, unit }?: ITadaAnimationCallbackInfo): ({ fraction, target, stage }: {
    fraction: any;
    target: any;
    stage: any;
}) => void;
