"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitTransition = exports.ResolveTransition = exports.DefaultTransitionRepeats = exports.DefaultTransitionDelay = exports.DefaultTransitionDuration = void 0;
const find_1 = require("../component/find");
const get_1 = require("../global/get");
const try_1 = require("../journal/try");
const loop_1 = require("../utilities/loop");
exports.DefaultTransitionDuration = 300;
exports.DefaultTransitionDelay = 0;
exports.DefaultTransitionRepeats = 0;
function ResolveTransition(info, reverse) {
    if (!info || (0, get_1.GetGlobal)().IsNothing(info) || (info.allowed && info.allowed !== 'both' && (info.allowed !== (reverse ? 'reversed' : 'normal')))) {
        return null;
    }
    const concept = (0, get_1.GetGlobal)().GetConcept('animation');
    return {
        ease: (info.ease || (concept === null || concept === void 0 ? void 0 : concept.GetEaseCollection().Find('default')) || null),
        actor: (info.actor || (concept === null || concept === void 0 ? void 0 : concept.GetActorCollection().Find('default')) || null),
        duration: (info.duration || exports.DefaultTransitionDuration),
        delay: (info.delay || exports.DefaultTransitionDelay),
        repeats: (info.repeats || exports.DefaultTransitionRepeats),
        allowed: (info.allowed || 'both'),
    };
}
exports.ResolveTransition = ResolveTransition;
function WaitTransition({ componentId, contextElement, target, callback, onAbort, onPass, reverse, allowRepeats, restore }) {
    var _a, _b, _c, _d;
    const resolvedTarget = (target || contextElement);
    if ('WaitTransition' in resolvedTarget && typeof resolvedTarget['WaitTransition'] === 'function') {
        return resolvedTarget['WaitTransition']({ componentId, contextElement, target, callback, onAbort, reverse, allowRepeats });
    }
    const info = ResolveTransition((((_b = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetData('transition')) || null), (reverse || false));
    if (!info || !info.actor || !info.ease || typeof info.duration !== 'number' || info.duration <= 0) {
        return ((callback(false) && false) || null);
    }
    const callActor = (params) => { var _a; return ((typeof (info === null || info === void 0 ? void 0 : info.actor) === 'function') ? info === null || info === void 0 ? void 0 : info.actor(params) : (info && ((_a = info.actor) === null || _a === void 0 ? void 0 : _a.Handle(params)))); };
    const callEase = (params) => { var _a; return ((typeof info.ease === 'function') ? info.ease(params) : ((info && ((_a = info.ease) === null || _a === void 0 ? void 0 : _a.Handle(params))) || 0)); };
    let aborted = false, steps = 0;
    const abort = () => (aborted = true), getFraction = (fraction) => (reverse ? (1 - fraction) : fraction), onAborted = () => {
        var _a, _b;
        (_b = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.RemoveUninitCallback(abort);
        resolvedTarget.dispatchEvent(new CustomEvent('transition.canceled'));
        onAbort && (0, try_1.JournalTry)(() => onAbort());
        return false;
    };
    const callOnPass = (stage, elapsed, fraction) => {
        onPass && (0, try_1.JournalTry)(() => onPass({ duration: info.duration, elapsed, fraction, target: resolvedTarget, stage }));
    };
    (_d = (_c = (0, find_1.FindComponentById)(componentId)) === null || _c === void 0 ? void 0 : _c.FindElementScope(contextElement)) === null || _d === void 0 ? void 0 : _d.AddUninitCallback(abort);
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
    (0, loop_1.CreateAnimationLoop)(duration, 0, (allowRepeats ? info.repeats : 0), info.delay).While(({ elapsed }) => {
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
            (0, try_1.JournalTry)(() => callback(true));
        }
        else {
            onAborted();
        }
    });
    return abort;
}
exports.WaitTransition = WaitTransition;
