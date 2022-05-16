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
import { CreateAnimationActorCallback } from "../callback";
export const DefaultRotateAnimationActorFactor = 360;
export const DefaultRotateAnimationActorUnit = 'deg';
export function CreateRotateAnimationCallback({ axis = 'z', origin, factor, unit } = {}) {
    let translateOrigin = (value) => ((value !== 'center') ? ((value === 'end') ? '100%' : '0%') : '50%');
    let translatedOrigin = `${translateOrigin((origin === null || origin === void 0 ? void 0 : origin.x) || 'center')} ${translateOrigin((origin === null || origin === void 0 ? void 0 : origin.y) || 'center')}`;
    let validFactor = (factor ? factor : DefaultRotateAnimationActorFactor), validUnit = (unit ? unit : DefaultRotateAnimationActorUnit);
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
export function CreateRotateAnimationActor(_a) {
    var { name } = _a, rest = __rest(_a, ["name"]);
    return CreateAnimationActorCallback(name, CreateRotateAnimationCallback(rest));
}
