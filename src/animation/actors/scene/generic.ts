import { AnimationActorCallbackType, IAnimationActor, IAnimationActorParams } from "../../../types/animation";
import { CreateAnimationActorCallback } from "../callback";

export type SceneAnimatorActorOriginType = 'start' | 'center' | 'end';

export interface ISceneAnimatorActorOrigin{
    x: SceneAnimatorActorOriginType;
    y: SceneAnimatorActorOriginType;
}

export interface ISceneAnimationFrame{
    actor: AnimationActorCallbackType | IAnimationActor;
    checkpoint: number | Array<number>;
}

export interface ISceneAnimationFrameFlat{
    actor: AnimationActorCallbackType | IAnimationActor;
    checkpoint: number;
}

export interface ISceneAnimationFrameRange{
    from: number;
    to: number | null;
}

export interface ISceneAnimationFrameOptimized{
    actor: AnimationActorCallbackType | IAnimationActor;
    range: ISceneAnimationFrameRange;
}

export interface ISceneAnimationCallbackInfo{
    frames: Array<ISceneAnimationFrame>;
    origin?: ISceneAnimatorActorOrigin;
}

export interface ISceneAnimationActorInfo extends ISceneAnimationCallbackInfo{
    name: string;
}

export function CreateSceneAnimationCallback({ frames, origin }: ISceneAnimationCallbackInfo){
    let flatFrames = new Array<ISceneAnimationFrameFlat>();
    frames.forEach(({ actor, checkpoint }) => (Array.isArray(checkpoint) ? flatFrames.push(...checkpoint.map(c => ({ actor, checkpoint: c }))) : flatFrames.push({ actor, checkpoint  })))
    
    flatFrames = flatFrames.sort((first, second) => ((first.checkpoint <= second.checkpoint) ? ((first.checkpoint < second.checkpoint) ? -1 : 0) : 1));

    let computeFrameExtent = (index: number) => ((index < flatFrames.length) ? flatFrames[index].checkpoint : null);
    let optimizedFrames = flatFrames.map(({ actor, checkpoint }, index) => <ISceneAnimationFrameOptimized>{ actor, range: { from: checkpoint, to: computeFrameExtent(index + 1) } });
    
    let translateOrigin = (value: SceneAnimatorActorOriginType) => ((value !== 'center') ? ((value === 'end') ? '100%' : '0%') : '50%');
    let translatedOrigin = (origin ? `${translateOrigin(origin.x)} ${translateOrigin(origin.y)}` : '');
    
    let checkpointIsInFrame = (frame: ISceneAnimationFrameOptimized, checkpoint: number) => (frame.range.from <= checkpoint && (frame.range.to === null || checkpoint < frame.range.to));
    let currentFrame: ISceneAnimationFrameOptimized | null = null, findFrame = (checkpoint: number) => optimizedFrames.find(frame => checkpointIsInFrame(frame, checkpoint));

    let callActor = (actor: AnimationActorCallbackType | IAnimationActor, params: IAnimationActorParams) => ((typeof actor === 'function') ? actor(params) : actor.Handle(params));
    return ({ fraction, target, stage }) => {
        if (stage === 'start'){
            currentFrame = null;
            translatedOrigin && (target.style.transformOrigin = translatedOrigin);
        }
        
        let checkpoint = (fraction * 100);
        if (!currentFrame || !checkpointIsInFrame(currentFrame, checkpoint)){
            currentFrame = (findFrame(checkpoint) || null);
        }

        if (currentFrame){
            callActor(currentFrame.actor, { fraction: ((checkpoint - currentFrame.range.from) / (currentFrame.range.to || 100)), target, stage });
        }
    };
}

export function CreateSceneAnimationActor({ name, ...rest }: ISceneAnimationActorInfo){
    return CreateAnimationActorCallback(name, CreateSceneAnimationCallback(rest));
}

export function ApplyRange(fraction: number, from: number, to: number){
    return (((to - from) * fraction) + from);
}

export function ApplyTransform(target: HTMLElement, name: string, value: string){
    target.style.transform = target.style.transform.replace(new RegExp(`[ ]*${name}([XYZ]|3d)?\\(.+?\\)`, 'g'), '');
    target.style.transform += (value ? ` ${name}(${value})` : ` ${name}`);
}

export function FormatValue(value: string, count?: number){
    return ((count && count > 1) ? Array.from({ length: count }).map(i => value).join(',') : value);
}

export function ApplyRangeAndTransform(target: HTMLElement, name: string, fraction: number, from: number, to: number, unit?: string, count?: number){
    ApplyTransform(target, name, FormatValue(`${ApplyRange(fraction, from, to)}${unit ? unit : ''}`, count));
}
