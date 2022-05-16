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
exports.CreateRotateAnimationActor = exports.CreateRotateAnimationCallback = exports.DefaultRotateAnimationActorUnit = exports.DefaultRotateAnimationActorFactor = void 0;
const callback_1 = require("../callback");
exports.DefaultRotateAnimationActorFactor = 360;
exports.DefaultRotateAnimationActorUnit = 'deg';
function CreateRotateAnimationCallback({ axis = 'z', origin, factor, unit } = {}) {
    let translateOrigin = (value) => ((value !== 'center') ? ((value === 'end') ? '100%' : '0%') : '50%');
    let translatedOrigin = `${translateOrigin((origin === null || origin === void 0 ? void 0 : origin.x) || 'center')} ${translateOrigin((origin === null || origin === void 0 ? void 0 : origin.y) || 'center')}`;
    let validFactor = (factor ? factor : exports.DefaultRotateAnimationActorFactor), validUnit = (unit ? unit : exports.DefaultRotateAnimationActorUnit);
    return ({ fraction, target, stage }) => {
        if (stage === 'start') {
            target.style.transformOrigin = translatedOrigin;
        }
        let delta = ((validFactor < 0) ? (validFactor + (-validFactor * fraction)) : (validFactor - (validFactor * fraction))), axisList = {
            x: ((axis === 'x' || axis === 'all') ? 1 : 0),
            y: ((axis === 'y' || axis === 'all') ? 1 : 0),
            z: ((!axis || axis === 'z' || axis === 'all') ? 1 : 0),
        };
        target.style.transform = target.style.transform.replace(/[ ]*rotate([XYZ]|3d)?\(.+?\)/g, '');
        target.style.transform += ` rotate3d(${axisList.x},${axisList.y},${axisList.z},${delta}${validUnit})`;
    };
}
exports.CreateRotateAnimationCallback = CreateRotateAnimationCallback;
function CreateRotateAnimationActor(_a) {
    var { name } = _a, rest = __rest(_a, ["name"]);
    return (0, callback_1.CreateAnimationActorCallback)(name, CreateRotateAnimationCallback(rest));
}
exports.CreateRotateAnimationActor = CreateRotateAnimationActor;
