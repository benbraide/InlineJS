export interface IShakeAnimationCallbackInfo {
    displacement?: number;
    unit?: string;
}
export declare function ShakeAnimationCreator({ displacement, unit }?: IShakeAnimationCallbackInfo): ({ fraction, target, stage }: {
    fraction: any;
    target: any;
    stage: any;
}) => void;
