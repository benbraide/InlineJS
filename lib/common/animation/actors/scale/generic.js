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
exports.CreateScaleAnimationActor = exports.CreateScaleAnimationCallback = void 0;
const callback_1 = require("../callback");
function CreateScaleAnimationCallback({ axis, origin, factor } = {}) {
    let translateOrigin = (value) => ((value !== 'center') ? ((value === 'end') ? '100%' : '0%') : '50%');
    let translatedOrigin = `${translateOrigin((origin === null || origin === void 0 ? void 0 : origin.x) || 'center')} ${translateOrigin((origin === null || origin === void 0 ? void 0 : origin.y) || 'center')}`, validFactor = ((factor && factor > 0) ? factor : 1);
    return ({ fraction, target, stage }) => {
        if (stage === 'start') {
            target.style.transformOrigin = translatedOrigin;
        }
        fraction = ((validFactor != 1) ? ((validFactor < 1) ? (1 - (validFactor * (1 - fraction))) : (((validFactor - 1) - ((validFactor - 1) * fraction)) + 1)) : fraction);
        let value = ((axis !== 'x') ? ((axis === 'y') ? `scaleY(${fraction})` : `scale(${fraction}, ${fraction})`) : `scaleX(${fraction})`);
        target.style.transform = target.style.transform.replace(/[ ]*scale[XY]?\(.+?\)/g, '');
        target.style.transform += ` ${value}`;
    };
}
exports.CreateScaleAnimationCallback = CreateScaleAnimationCallback;
function CreateScaleAnimationActor(_a) {
    var { name } = _a, rest = __rest(_a, ["name"]);
    return (0, callback_1.CreateAnimationActorCallback)(name, CreateScaleAnimationCallback(rest));
}
exports.CreateScaleAnimationActor = CreateScaleAnimationActor;
