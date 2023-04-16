import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { IAnimationActorParams, IAnimationConcept, IAnimationEaseParams, IAnimationTransition } from "../types/animation";
import { CreateAnimationLoop } from "../utilities/loop";

export interface ITransitionParams{
    componentId: string;
    contextElement: HTMLElement;
    target?: HTMLElement;
    callback: (waited: boolean) => any;
    onAbort?: () => void;
    reverse?: boolean;
    allowRepeats?: boolean;
}

export const DefaultTransitionDuration = 300;
export const DefaultTransitionDelay = 0;
export const DefaultTransitionRepeats = 0;

export function ResolveTransition(info: IAnimationTransition | null, reverse: boolean){
    if (!info || GetGlobal().IsNothing(info) || (info.allowed && info.allowed !== 'both' && (info.allowed !== (reverse ? 'reversed' : 'normal')))){
        return null;
    }

    let concept = GetGlobal().GetConcept<IAnimationConcept>('animation');
    info.ease = (info.ease || concept?.GetEaseCollection().Find('default') || null);
    info.actor = (info.actor || concept?.GetActorCollection().Find('default') || null);
    info.duration = (info.duration || DefaultTransitionDuration);
    info.delay = (info.delay || DefaultTransitionDelay);
    info.repeats = (info.repeats || DefaultTransitionRepeats);

    return info;
}

export function WaitTransition({ componentId, contextElement, target, callback, onAbort, reverse, allowRepeats }: ITransitionParams): (() => void) | null{
    if ('WaitTransition' in (target || contextElement) && typeof (target || contextElement)['WaitTransition'] === 'function'){
        return ((target || contextElement)['WaitTransition'] as any)({ componentId, contextElement, target, callback, onAbort, reverse, allowRepeats });
    }
    
    let info = ResolveTransition((FindComponentById(componentId)?.FindElementScope(contextElement)?.GetData('transition') || null), (reverse || false));
    if (!info || !info.actor || !info.ease || typeof info.duration !== 'number' || info.duration <= 0){
        return ((callback(false) && false) || null);
    }

    let callActor = (params: IAnimationActorParams) => ((typeof info?.actor === 'function') ? info?.actor(params) : (info && info.actor?.Handle(params)));
    let callEase = (params: IAnimationEaseParams) => ((typeof info!.ease === 'function') ? info!.ease(params) : ((info && info.ease?.Handle(params)) || 0));

    let aborted = false, abort = () => (aborted = true), steps = 0, getFraction = (fraction: number) => (reverse ? (1 - fraction) : fraction), onAborted = () => {
        FindComponentById(componentId)?.FindElementScope(contextElement)?.RemoveUninitCallback(abort);
        (target || contextElement).dispatchEvent(new CustomEvent('transition.canceled'));
        onAbort && onAbort();
        return false;
    };

    FindComponentById(componentId)?.FindElementScope(contextElement)?.AddUninitCallback(abort);

    CreateAnimationLoop(info.duration, 0, (allowRepeats ? info.repeats : 0), info.delay).While(({ elapsed }) => {
        if (aborted){
            return onAborted();
        }
        
        if (steps == 0){
            (target || contextElement).style.transform = '';
            (target || contextElement).style.transformOrigin = '50% 50%';
            (target || contextElement).dispatchEvent(new CustomEvent('transition.enter'));
        }

        callActor({
            target: (target || contextElement),
            stage: ((steps++ == 0) ? 'start' : 'middle'),
            fraction: callEase({ duration: info!.duration, elapsed, fraction: getFraction(elapsed / info!.duration) }),
        });
    }).Final(() => {
        if (!aborted){
            callActor({//Final step
                target: (target || contextElement),
                stage: 'end',
                fraction: callEase({ duration: info!.duration, elapsed: info!.duration, fraction: getFraction(1) }),
            });
            
            (target || contextElement).dispatchEvent(new CustomEvent('transition.leave'));
            JournalTry(() => callback(true));
        }
        else{
            onAborted();
        }
    });
    
    return abort;
}
