"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BezierAnimationEaseCreator = void 0;
function BezierAnimationEaseCreator(points) {
    return ({ fraction }) => {
        if (fraction == 1) {
            return fraction;
        }
        let [first, second, third, fourth] = points.map(pt => (pt * 0.001));
        let firstDiff = (3 * (second - first));
        let secondDiff = ((3 * (third - second)) - firstDiff);
        let thirdDiff = ((fourth - first) - firstDiff - secondDiff);
        return ((firstDiff * Math.pow(fraction, 3)) + (secondDiff * Math.pow(fraction, 2)) + (thirdDiff * fraction));
    };
}
exports.BezierAnimationEaseCreator = BezierAnimationEaseCreator;
