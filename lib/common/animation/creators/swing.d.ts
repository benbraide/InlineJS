export declare type SwingAnimatorCreatorOriginType = 'start' | 'center' | 'end';
export interface ISwingAnimatorActorOrigin {
    x?: SwingAnimatorCreatorOriginType;
    y?: SwingAnimatorCreatorOriginType;
}
export interface ISwingAnimationCallbackInfo {
    displacement?: number;
    origin?: ISwingAnimatorActorOrigin;
    unit?: string;
}
export declare function SwingAnimationCreator({ displacement, unit, origin: { x, y } }?: ISwingAnimationCallbackInfo): ({ fraction, target, stage }: {
    fraction: any;
    target: any;
    stage: any;
}) => void;
