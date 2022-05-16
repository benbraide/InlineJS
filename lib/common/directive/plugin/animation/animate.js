"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimateDirectiveHandlerCompact = exports.AnimateDirectiveHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const get_1 = require("../../../global/get");
const lazy_1 = require("../../lazy");
const transition_1 = require("../../transition");
exports.AnimateDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('animate', (_a) => {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var { componentId, contextElement, argKey, argOptions } = _a, rest = __rest(_a, ["componentId", "contextElement", "argKey", "argOptions"]);
    let options = {
        alternate: argOptions.includes('alternate'),
        normal: argOptions.includes('normal'),
        inner: (argKey === 'inner'),
    };
    argOptions = argOptions.filter(opt => (opt !== 'normal'));
    let traverseTargets = (callback) => (options.inner ? Array.from(contextElement.children) : [contextElement]).forEach((target) => {
        callback(target);
    });
    let checkpoint = 0, bind = () => {
        let waitTransition = (reverse, target, callback) => {
            let myCheckpoint = ++checkpoint;
            transitionCancel = (0, transition_1.WaitTransition)({ componentId, contextElement, target, reverse,
                callback: (waited) => {
                    if (myCheckpoint == checkpoint) {
                        transitionCancel = null;
                        if (waited) {
                            callback && callback();
                        }
                        else {
                            traverseTargets(child => child.style.removeProperty('transform'));
                        }
                    }
                },
            });
        };
        let childIndex = 0, handleInner = (reverse) => {
            if (childIndex < contextElement.children.length) {
                waitTransition(reverse, contextElement.children[childIndex++], () => handleInner(reverse));
            }
            else {
                repeat(options.alternate ? !reverse : reverse);
            }
        };
        let begin = (reverse) => {
            checkpoint += 1;
            if (options.inner) {
                childIndex = 0;
                handleInner(reverse);
            }
            else {
                waitTransition(reverse, undefined, () => repeat(options.alternate ? !reverse : reverse));
            }
        };
        let repeat = (reverse) => {
            var _a, _b;
            let info = (0, transition_1.ResolveTransition)((((_b = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetData('transition')) || null), reverse);
            if (info && info.repeats) {
                let myCheckpoint = ++checkpoint;
                (info.repeats > 0) && (info.repeats -= 1);
                setTimeout(() => {
                    if (myCheckpoint == checkpoint) {
                        contextElement.dispatchEvent(new CustomEvent('animate.repeat'));
                        begin(reverse);
                    }
                }, (info.delay || transition_1.DefaultTransitionDelay));
            }
        };
        let lastValue = false, transitionCancel = null, apply = (value) => {
            if (!!value === lastValue) {
                return;
            }
            if (transitionCancel) {
                transitionCancel();
                (options.inner ? Array.from(contextElement.children) : [contextElement]).forEach(child => {
                    child.style.removeProperty('transform');
                    child.style.removeProperty('opacity');
                });
            }
            if (!options.normal || !!value) {
                begin(!value);
            }
            lastValue = !!value;
        };
        (0, lazy_1.LazyCheck)(Object.assign(Object.assign({ componentId, contextElement, argKey, argOptions }, rest), { callback: apply }));
    };
    if (options.inner) {
        (_c = (_b = (0, find_1.FindComponentById)(componentId)) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.AddPostProcessCallback(bind);
    }
    else { //Immediate
        bind();
    }
    let data = (_e = (_d = (0, find_1.FindComponentById)(componentId)) === null || _d === void 0 ? void 0 : _d.FindElementScope(contextElement)) === null || _e === void 0 ? void 0 : _e.GetData('transition');
    if (!data || (0, get_1.GetGlobal)().IsNothing(data)) {
        (_g = (_f = (0, find_1.FindComponentById)(componentId)) === null || _f === void 0 ? void 0 : _f.FindElementScope(contextElement)) === null || _g === void 0 ? void 0 : _g.SetData('transition', {
            actor: null,
            ease: null,
            duration: transition_1.DefaultTransitionDuration,
            repeats: transition_1.DefaultTransitionRepeats,
            delay: transition_1.DefaultTransitionDelay,
            allowed: (!argOptions.includes('normal') ? (argOptions.includes('reversed') ? 'reversed' : 'both') : 'normal'),
        });
    }
    (_j = (_h = (0, find_1.FindComponentById)(componentId)) === null || _h === void 0 ? void 0 : _h.FindElementScope(contextElement)) === null || _j === void 0 ? void 0 : _j.AddUninitCallback(() => (checkpoint += 1));
});
function AnimateDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.AnimateDirectiveHandler);
}
exports.AnimateDirectiveHandlerCompact = AnimateDirectiveHandlerCompact;
