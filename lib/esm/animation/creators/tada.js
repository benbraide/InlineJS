import { ApplyRange, ApplyTransform, CreateSceneAnimationCallback } from "../actors/scene/generic";
export function TadaAnimationCreator({ displacement = 3, fromFactor = 0.9, toFactor = 1.17, unit = 'deg' } = {}) {
    return CreateSceneAnimationCallback({
        frames: [
            { checkpoint: 0, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, 0, 0, null, 1, unit) },
            { checkpoint: 1, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, 0, displacement, 1, fromFactor, unit, true) },
            { checkpoint: 10, actor: () => { } },
            { checkpoint: 20, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, -displacement, displacement, fromFactor, toFactor, unit) },
            { checkpoint: 30, actor: () => { } },
            { checkpoint: [40, 60, 80], actor: ({ target, fraction }) => ComputeAndApply(target, fraction, -displacement, displacement, null, toFactor, unit) },
            { checkpoint: [50, 70], actor: ({ target, fraction }) => ComputeAndApply(target, fraction, displacement, -displacement, null, toFactor, unit) },
            { checkpoint: 90, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, displacement, 0, toFactor, 1, unit) },
            { checkpoint: 100, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, 0, 0, null, 1, unit) },
        ],
    });
}
function ComputeAndApply(target, fraction, rotateFrom, rotateTo, fromFactor, toFactor, unit, pivot = false) {
    let scaleValue = ((fromFactor === null) ? toFactor : ApplyRange(fraction, fromFactor, toFactor));
    let rotateValue = ApplyRange(fraction, rotateFrom, rotateTo);
    let rotateTranslateValue = (pivot ? ApplyRange(fraction, 0, 1) : 1);
    target.style.transform = target.style.transform.replace(/[ ]*rotate([XYZ]|3d)?\(.+?\)/, '');
    target.style.transform += ` rotate3d(0,0,${rotateTranslateValue},${rotateValue}${unit})`;
    ApplyTransform(target, 'scale', `${scaleValue},${scaleValue}`);
}
