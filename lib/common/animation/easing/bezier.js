"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBezierAnimationEaseCallback = void 0;
const to_string_1 = require("../../utilities/to-string");
const callback_1 = require("./callback");
function CreateBezierAnimationEaseCallback(points) {
    let transformedPoints = points.map(pt => ((typeof pt !== 'number') ? parseInt((0, to_string_1.ToString)(pt)) : pt));
    return (0, callback_1.CreateAnimationEaseCallback)(`bezier.${points.join('.')}`, ({ fraction }) => {
        if (fraction == 1) {
            return fraction;
        }
        let [first, second, third, fourth] = transformedPoints.map(pt => (pt * 0.001));
        let firstDiff = (3 * (second - first));
        let secondDiff = ((3 * (third - second)) - firstDiff);
        let thirdDiff = ((fourth - first) - firstDiff - secondDiff);
        return ((firstDiff * Math.pow(fraction, 3)) + (secondDiff * Math.pow(fraction, 2)) + (thirdDiff * fraction));
    });
}
exports.CreateBezierAnimationEaseCallback = CreateBezierAnimationEaseCallback;
