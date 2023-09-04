import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { CreateAnimationLoop } from "../utilities/loop";
export const DefaultTransitionDuration = 300;
export const DefaultTransitionDelay = 0;
export const DefaultTransitionRepeats = 0;
export function ResolveTransition(info, reverse) {
    if (!info || GetGlobal().IsNothing(info) || (info.allowed && info.allowed !== 'both' && (info.allowed !== (reverse ? 'reversed' : 'normal')))) {
        return null;
    }
    let concept = GetGlobal().GetConcept('animation');
    return {
        ease: (info.ease || (concept === null || concept === void 0 ? void 0 : concept.GetEaseCollection().Find('default')) || null),
        actor: (info.actor || (concept === null || concept === void 0 ? void 0 : concept.GetActorCollection().Find('default')) || null),
        duration: (info.duration || DefaultTransitionDuration),
        delay: (info.delay || DefaultTransitionDelay),
        repeats: (info.repeats || DefaultTransitionRepeats),
        allowed: (info.allowed || 'both'),
    };
}
export function WaitTransition({ componentId, contextElement, target, callback, onAbort, onPass, reverse, allowRepeats, restore }) {
    var _a, _b, _c, _d;
    let resolvedTarget = (target || contextElement);
    if ('WaitTransition' in resolvedTarget && typeof resolvedTarget['WaitTransition'] === 'function') {
        return resolvedTarget['WaitTransition']({ componentId, contextElement, target, callback, onAbort, reverse, allowRepeats });
    }
    let info = ResolveTransition((((_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetData('transition')) || null), (reverse || false));
    if (!info || !info.actor || !info.ease || typeof info.duration !== 'number' || info.duration <= 0) {
        return ((callback(false) && false) || null);
    }
    let callActor = (params) => { var _a; return ((typeof (info === null || info === void 0 ? void 0 : info.actor) === 'function') ? info === null || info === void 0 ? void 0 : info.actor(params) : (info && ((_a = info.actor) === null || _a === void 0 ? void 0 : _a.Handle(params)))); };
    let callEase = (params) => { var _a; return ((typeof info.ease === 'function') ? info.ease(params) : ((info && ((_a = info.ease) === null || _a === void 0 ? void 0 : _a.Handle(params))) || 0)); };
    let aborted = false, abort = () => (aborted = true), steps = 0, getFraction = (fraction) => (reverse ? (1 - fraction) : fraction), onAborted = () => {
        var _a, _b;
        (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.RemoveUninitCallback(abort);
        resolvedTarget.dispatchEvent(new CustomEvent('transition.canceled'));
        onAbort && JournalTry(() => onAbort());
        return false;
    };
    let callOnPass = (stage, elapsed, fraction) => {
        onPass && JournalTry(() => onPass({ duration: info.duration, elapsed, fraction, target: resolvedTarget, stage }));
    };
    (_d = (_c = FindComponentById(componentId)) === null || _c === void 0 ? void 0 : _c.FindElementScope(contextElement)) === null || _d === void 0 ? void 0 : _d.AddUninitCallback(abort);
    const duration = info.duration, doStep = (elapsed) => {
        const elapsedFraction = getFraction(elapsed / duration);
        const fraction = callEase({ duration, elapsed, fraction: elapsedFraction }), stage = ((steps++ == 0) ? 'start' : 'middle');
        callActor({
            duration, elapsed, fraction, elapsedFraction, stage, restore,
            target: resolvedTarget,
            reverse: !!reverse,
        });
        callOnPass(stage, elapsed, fraction);
    };
    doStep(0); //Initial step
    CreateAnimationLoop(duration, 0, (allowRepeats ? info.repeats : 0), info.delay).While(({ elapsed }) => {
        if (aborted) {
            return onAborted();
        }
        if (steps == 0) {
            resolvedTarget.style.transform = '';
            resolvedTarget.style.transformOrigin = '50% 50%';
            resolvedTarget.dispatchEvent(new CustomEvent('transition.enter'));
        }
        doStep(elapsed);
    }).Final(() => {
        if (!aborted) {
            const elapsedFraction = getFraction(1);
            callActor({
                duration, elapsedFraction,
                elapsed: duration,
                target: resolvedTarget,
                stage: 'end',
                fraction: callEase({ duration: info.duration, elapsed: info.duration, fraction: elapsedFraction }),
                reverse: !!reverse,
            });
            callOnPass('end', info.duration, elapsedFraction);
            resolvedTarget.dispatchEvent(new CustomEvent('transition.leave'));
            JournalTry(() => callback(true));
        }
        else {
            onAborted();
        }
    });
    return abort;
}
