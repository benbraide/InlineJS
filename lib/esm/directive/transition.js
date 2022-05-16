import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { CreateLoop } from "../utilities/loop";
export const DefaultTransitionDuration = 300;
export const DefaultTransitionDelay = 0;
export const DefaultTransitionRepeats = 0;
export function ResolveTransition(info, reverse) {
    if (!info || GetGlobal().IsNothing(info) || (info.allowed && info.allowed !== 'both' && (info.allowed !== (reverse ? 'reversed' : 'normal')))) {
        return null;
    }
    let concept = GetGlobal().GetConcept('animation');
    info.ease = (info.ease || (concept === null || concept === void 0 ? void 0 : concept.GetEaseCollection().Find('default')) || null);
    info.actor = (info.actor || (concept === null || concept === void 0 ? void 0 : concept.GetActorCollection().Find('default')) || null);
    info.duration = (info.duration || DefaultTransitionDuration);
    info.delay = (info.delay || DefaultTransitionDelay);
    info.repeats = (info.repeats || DefaultTransitionRepeats);
    return info;
}
export function WaitTransition({ componentId, contextElement, target, callback, onAbort, reverse, allowRepeats }) {
    var _a, _b, _c, _d;
    let info = ResolveTransition((((_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetData('transition')) || null), (reverse || false));
    if (!info || !info.actor || !info.ease || typeof info.duration !== 'number' || info.duration <= 0) {
        return ((callback(false) && false) || null);
    }
    let callActor = (params) => { var _a; return ((typeof (info === null || info === void 0 ? void 0 : info.actor) === 'function') ? info === null || info === void 0 ? void 0 : info.actor(params) : (info && ((_a = info.actor) === null || _a === void 0 ? void 0 : _a.Handle(params)))); };
    let callEase = (params) => { var _a; return ((typeof info.ease === 'function') ? info.ease(params) : ((info && ((_a = info.ease) === null || _a === void 0 ? void 0 : _a.Handle(params))) || 0)); };
    let aborted = false, abort = () => (aborted = true), steps = 0, getFraction = (fraction) => (reverse ? (1 - fraction) : fraction), onAborted = () => {
        var _a, _b;
        (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.RemoveUninitCallback(abort);
        (target || contextElement).dispatchEvent(new CustomEvent('transition.canceled'));
        onAbort && onAbort();
        return false;
    };
    (_d = (_c = FindComponentById(componentId)) === null || _c === void 0 ? void 0 : _c.FindElementScope(contextElement)) === null || _d === void 0 ? void 0 : _d.AddUninitCallback(abort);
    CreateLoop(info.duration, 0, (allowRepeats ? info.repeats : 0), info.delay).While(({ elapsed }) => {
        if (aborted) {
            return onAborted();
        }
        if (steps == 0) {
            (target || contextElement).style.transform = '';
            (target || contextElement).style.transformOrigin = '50% 50%';
            (target || contextElement).dispatchEvent(new CustomEvent('transition.enter'));
        }
        callActor({
            target: (target || contextElement),
            stage: ((steps++ == 0) ? 'start' : 'middle'),
            fraction: callEase({ duration: info.duration, elapsed, fraction: getFraction(elapsed / info.duration) }),
        });
    }).Final(() => {
        if (!aborted) {
            callActor({
                target: (target || contextElement),
                stage: 'end',
                fraction: callEase({ duration: info.duration, elapsed: info.duration, fraction: getFraction(1) }),
            });
            (target || contextElement).dispatchEvent(new CustomEvent('transition.leave'));
            JournalTry(() => callback(true));
        }
        else {
            onAborted();
        }
    });
    return abort;
}
