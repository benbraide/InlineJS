export interface IVibrateAnimationCallbackInfo {
    displacement?: number;
    unit?: string;
}
export declare function VibrateAnimationCreator({ displacement, unit }?: IVibrateAnimationCallbackInfo): ({ fraction, target, stage }: {
    fraction: any;
    target: any;
    stage: any;
}) => void;
