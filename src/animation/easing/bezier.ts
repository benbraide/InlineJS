import { ToString } from "../../utilities/to-string";
import { CreateAnimationEaseCallback } from "./callback";

export function CreateBezierAnimationEaseCallback(points: [any, any, any, any]){
    let transformedPoints = points.map(pt => ((typeof pt !== 'number') ? parseInt(ToString(pt)) : pt));
    return CreateAnimationEaseCallback(`bezier.${points.join('.')}`, ({ fraction }) => {
        if (fraction == 1){
            return fraction;
        }
        
        let [first, second, third, fourth] = transformedPoints.map(pt => (pt * 0.001));
        
        let firstDiff = (3 * (second - first));
        let secondDiff = ((3 * (third - second)) - firstDiff);
        let thirdDiff = ((fourth - first) - firstDiff - secondDiff);

        return ((firstDiff * Math.pow(fraction, 3)) + (secondDiff * Math.pow(fraction, 2)) + (thirdDiff * fraction));
    });
}
