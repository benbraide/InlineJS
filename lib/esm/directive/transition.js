import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { CreateAnimationLoop } from "../utilities/loop";
export const DefaultTransitionDuration = 300;
export const DefaultTransitionDelay = 0;
export const DefaultTransitionInitialDelay = 0;
export const DefaultTransitionRepeats = 0;
export function ResolveTransition(info, reverse) {
    if (!info || GetGlobal().IsNothing(info) || (info.allowed && info.allowed !== 'both' && (info.allowed !== (reverse ? 'reversed' : 'normal')))) {
        return null;
    }
    const concept = GetGlobal().GetConcept('animation');
    return {
        ease: (info.ease || (concept === null || concept === void 0 ? void 0 : concept.GetEaseCollection().Find('default')) || null),
        actor: (info.actor || (concept === null || concept === void 0 ? void 0 : concept.GetActorCollection().Find('default')) || null),
        duration: (info.duration || DefaultTransitionDuration),
        initialDelay: (info.initialDelay || DefaultTransitionInitialDelay),
        delay: (info.delay || DefaultTransitionDelay),
        repeats: (info.repeats || DefaultTransitionRepeats),
        allowed: (info.allowed || 'both'),
    };
}
export function WaitAnimation({ componentId, contextElement, target, keyframes, duration = 0, initialDelay = 0, delay = 0, repeats = 0, callback, onAbort }) {
    var _a, _b;
    if (duration <= 0) {
        JournalTry(() => callback(false));
        return null;
    }
    const resolvedTarget = target || contextElement;
    let handle = null;
    const animate = () => {
        if (aborted)
            return;
        resolvedTarget.dispatchEvent(new CustomEvent('transition.enter'));
        (handle = resolvedTarget.animate(keyframes)).finished.then(() => {
            resolvedTarget.dispatchEvent(new CustomEvent('transition.leave'));
            if (repeats === -1 || repeats > 0) {
                repeats > 0 && repeats--;
                setTimeout(() => animate(), delay);
            }
            JournalTry(() => callback(true));
        }).catch(() => {
            onAborted();
            JournalTry(() => callback(true));
        });
    };
    let aborted = false, abortComplete = false;
    const abort = () => {
        if (aborted)
            return;
        aborted = true;
        onAborted();
    };
    const onAborted = () => {
        var _a, _b;
        if (abortComplete)
            return;
        (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(resolvedTarget)) === null || _b === void 0 ? void 0 : _b.RemoveUninitCallback(abort);
        resolvedTarget.dispatchEvent(new CustomEvent('transition.canceled'));
        handle === null || handle === void 0 ? void 0 : handle.cancel();
        onAbort && JournalTry(() => onAbort());
        abortComplete = true;
        return false;
    };
    (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(resolvedTarget)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(abort);
    if (initialDelay > 0) {
        setTimeout(() => !aborted && animate(), initialDelay);
    }
    else {
        animate();
    }
    return abort;
}
export function WaitTransition({ componentId, contextElement, target, callback, onAbort, onPass, reverse, allowRepeats, restore }) {
    var _a, _b, _c, _d;
    const resolvedTarget = (target || contextElement);
    if ('WaitTransition' in resolvedTarget && typeof resolvedTarget['WaitTransition'] === 'function') {
        return resolvedTarget['WaitTransition']({ componentId, contextElement, target, callback, onAbort, reverse, allowRepeats });
    }
    const info = ResolveTransition((((_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetData('transition')) || null), (reverse || false));
    if (!info || !info.actor || !info.ease || typeof info.duration !== 'number' || info.duration <= 0) {
        return ((callback(false) && false) || null);
    }
    const callActor = (params) => { var _a; return ((typeof (info === null || info === void 0 ? void 0 : info.actor) === 'function') ? info === null || info === void 0 ? void 0 : info.actor(params) : (info && ((_a = info.actor) === null || _a === void 0 ? void 0 : _a.Handle(params)))); };
    const callEase = (params) => { var _a; return ((typeof info.ease === 'function') ? info.ease(params) : ((info && ((_a = info.ease) === null || _a === void 0 ? void 0 : _a.Handle(params))) || 0)); };
    let aborted = false, steps = 0;
    const abort = () => (aborted = true), getFraction = (fraction) => (reverse ? (1 - fraction) : fraction), onAborted = () => {
        var _a, _b;
        (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.RemoveUninitCallback(abort);
        resolvedTarget.dispatchEvent(new CustomEvent('transition.canceled'));
        onAbort && JournalTry(() => onAbort());
        return false;
    };
    const callOnPass = (stage, elapsed, fraction) => {
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
    const run = () => {
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
    };
    (info.initialDelay || 0) > 0 ? setTimeout(() => !aborted && run(), info.initialDelay) : run();
    return abort;
}
