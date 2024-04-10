import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { IAnimationActorParams, IAnimationConcept, IAnimationEaseParams, IAnimationTransition, AnimationStageType } from "../types/animation";
import { CreateAnimationLoop } from "../utilities/loop";

export interface IAnimationPassParams extends IAnimationEaseParams{
    target: HTMLElement;
    stage: AnimationStageType;
}

export interface ITransitionParams{
    componentId: string;
    contextElement: HTMLElement;
    target?: HTMLElement;
    callback: (waited: boolean) => any;
    onAbort?: () => void;
    onPass?: (params: IAnimationPassParams) => void;
    reverse?: boolean;
    allowRepeats?: boolean;
    restore?: boolean;
}

export const DefaultTransitionDuration = 300;
export const DefaultTransitionDelay = 0;
export const DefaultTransitionRepeats = 0;

export function ResolveTransition(info: IAnimationTransition | null, reverse: boolean): IAnimationTransition | null{
    if (!info || GetGlobal().IsNothing(info) || (info.allowed && info.allowed !== 'both' && (info.allowed !== (reverse ? 'reversed' : 'normal')))){
        return null;
    }

    const concept = GetGlobal().GetConcept<IAnimationConcept>('animation');
    return {
        ease: (info.ease || concept?.GetEaseCollection().Find('default') || null),
        actor: (info.actor || concept?.GetActorCollection().Find('default') || null),
        duration: (info.duration || DefaultTransitionDuration),
        delay: (info.delay || DefaultTransitionDelay),
        repeats: (info.repeats || DefaultTransitionRepeats),
        allowed: (info.allowed || 'both'),
    };
}

export function WaitTransition({ componentId, contextElement, target, callback, onAbort, onPass, reverse, allowRepeats, restore }: ITransitionParams): (() => void) | null{
    const resolvedTarget = (target || contextElement);
    if ('WaitTransition' in resolvedTarget && typeof resolvedTarget['WaitTransition'] === 'function'){
        return (resolvedTarget['WaitTransition'] as any)({ componentId, contextElement, target, callback, onAbort, reverse, allowRepeats });
    }
    
    const info = ResolveTransition((FindComponentById(componentId)?.FindElementScope(contextElement)?.GetData('transition') || null), (reverse || false));
    if (!info || !info.actor || !info.ease || typeof info.duration !== 'number' || info.duration <= 0){
        return ((callback(false) && false) || null);
    }

    const callActor = (params: IAnimationActorParams) => ((typeof info?.actor === 'function') ? info?.actor(params) : (info && info.actor?.Handle(params)));
    const callEase = (params: IAnimationEaseParams) => ((typeof info!.ease === 'function') ? info!.ease(params) : ((info && info.ease?.Handle(params)) || 0));

    let aborted = false, steps = 0;
    const abort = () => (aborted = true), getFraction = (fraction: number) => (reverse ? (1 - fraction) : fraction), onAborted = () => {
        FindComponentById(componentId)?.FindElementScope(contextElement)?.RemoveUninitCallback(abort);
        resolvedTarget.dispatchEvent(new CustomEvent('transition.canceled'));
        onAbort && JournalTry(() => onAbort());
        return false;
    };

    const callOnPass = (stage: AnimationStageType, elapsed: number, fraction: number) => {
        onPass && JournalTry(() => onPass({ duration: info!.duration, elapsed, fraction, target: resolvedTarget, stage }));
    };

    FindComponentById(componentId)?.FindElementScope(contextElement)?.AddUninitCallback(abort);

    const duration = info.duration, doStep = (elapsed: number) => {
        const elapsedFraction = getFraction(elapsed / duration);
        const fraction = callEase({ duration, elapsed, fraction: elapsedFraction }), stage: AnimationStageType = ((steps++ == 0) ? 'start' : 'middle');

        callActor({
            duration, elapsed, fraction, elapsedFraction, stage, restore,
            target: resolvedTarget,
            reverse: !!reverse,
        });

        callOnPass(stage, elapsed, fraction);
    };

    doStep(0);//Initial step

    CreateAnimationLoop(duration, 0, (allowRepeats ? info.repeats : 0), info.delay).While(({ elapsed }) => {
        if (aborted){
            return onAborted();
        }
        
        if (steps == 0){
            resolvedTarget.style.transform = '';
            resolvedTarget.style.transformOrigin = '50% 50%';
            resolvedTarget.dispatchEvent(new CustomEvent('transition.enter'));
        }
        
        doStep(elapsed);
    }).Final(() => {
        if (!aborted){
            const elapsedFraction = getFraction(1);
            callActor({//Final step
                duration, elapsedFraction,
                elapsed: duration,
                target: resolvedTarget,
                stage: 'end',
                fraction: callEase({ duration: info!.duration, elapsed: info!.duration, fraction: elapsedFraction }),
                reverse: !!reverse,
            });
            
            callOnPass('end', info!.duration, elapsedFraction);

            resolvedTarget.dispatchEvent(new CustomEvent('transition.leave'));
            JournalTry(() => callback(true));
        }
        else{
            onAborted();
        }
    });
    
    return abort;
}
