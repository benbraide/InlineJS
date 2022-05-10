import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { IAnimationActorParams, IAnimationConcept, IAnimationEaseParams, IAnimationTransition } from "../types/animation";
import { CreateLoop } from "../utilities/loop";

export interface ITransitionParams{
    componentId: string;
    contextElement: HTMLElement;
    target?: HTMLElement;
    callback: () => any;
    reverse?: boolean;
}

export function ResolveTransition(info: IAnimationTransition | null, reverse: boolean){
    if (!info || GetGlobal().IsNothing(info) || (info.allowed && info.allowed !== 'both' && (info.allowed !== (reverse ? 'reversed' : 'normal')))){
        return null;
    }

    let concept = GetGlobal().GetConcept<IAnimationConcept>('animation');
    info.ease = (info.ease || concept?.GetEaseCollection().Find('default') || null);
    info.actor = (info.actor || concept?.GetActorCollection().Find('default') || null);
    info.duration = (info.duration || 300);

    return info;
}

export function TransitionCheck({ componentId, contextElement, target, callback, reverse }: ITransitionParams): (() => void) | null{
    let info = ResolveTransition((FindComponentById(componentId)?.FindElementScope(contextElement)?.GetData('transition') || null), (reverse || false));
    if (!info || !info.actor || !info.ease || typeof info.duration !== 'number' || info.duration <= 0){
        return ((callback() && false) || null);
    }

    let callActor = (params: IAnimationActorParams) => ((typeof info?.actor === 'function') ? info?.actor(params) : (info && info.actor?.Handle(params)));
    let callEase = (params: IAnimationEaseParams) => ((typeof info!.ease === 'function') ? info!.ease(params) : ((info && info.ease?.Handle(params)) || 0));

    let aborted = false, abort = () => (aborted = true), steps = 0, getFraction = (fraction: number) => (reverse ? (1 - fraction) : fraction);
    CreateLoop(info.duration, 0).While(({ elapsed }) => {
        if (!aborted){
            (steps == 0) && (target || contextElement).dispatchEvent(new CustomEvent('transition.enter'));
            callActor({
                target: (target || contextElement),
                stage: ((steps++ == 0) ? 'start' : 'middle'),
                fraction: callEase({ duration: info!.duration, elapsed, fraction: getFraction(elapsed / info!.duration) }),
            });
        }
        else{
            (target || contextElement).dispatchEvent(new CustomEvent('transition.canceled'));
        }
    }).Final(() => {
        if (!aborted){
            callActor({//Final step
                target: (target || contextElement),
                stage: 'end',
                fraction: callEase({ duration: info!.duration, elapsed: info!.duration, fraction: getFraction(1) }),
            });
            JournalTry(callback);
            (target || contextElement).dispatchEvent(new CustomEvent('transition.leave'));
        }
        else{
            (target || contextElement).dispatchEvent(new CustomEvent('transition.canceled'));
        }
    });
    
    return abort;
}
