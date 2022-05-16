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
export const DefaultTranslateAnimationActorFactor = 9999;
export const DefaultTranslateAnimationActorUnit = 'px';
export function CreateTranslateAnimationCallback({ axis, factor, unit } = {}) {
    let validFactor = (factor ? factor : DefaultTranslateAnimationActorFactor);
    let validUnit = (unit ? unit : DefaultTranslateAnimationActorUnit);
    return ({ fraction, target }) => {
        let delta = ((validFactor < 0) ? (validFactor + (-validFactor * fraction)) : (validFactor - (validFactor * fraction)));
        let value = ((axis !== 'x') ? ((axis === 'y') ? `translateY(${delta}${validUnit})` : `translate(${delta}${validUnit}, ${delta}${validUnit})`) : `translateX(${delta}${validUnit})`);
        target.style.transform = target.style.transform.replace(/[ ]*translate[XY]?\(.+?\)/g, '');
        target.style.transform += ` ${value}`;
    };
}
export function CreateTranslateAnimationActor(_a) {
    var { name } = _a, rest = __rest(_a, ["name"]);
    return CreateAnimationActorCallback(name, CreateTranslateAnimationCallback(rest));
}
