import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";
export const ElasticAnimationEase = CreateAnimationEaseCallback('elastic', ({ fraction }) => {
    return ((fraction == 0 || fraction == 1) ? fraction : (Math.pow(2, (-10 * fraction)) * Math.sin(((fraction * 10) - 0.75) * ((2 * Math.PI) / 3)) + 1));
});
export function ElasticAnimationEaseCompact() {
    AddAnimationEase(ElasticAnimationEase);
}
export const ElasticInAnimationEase = CreateAnimationEaseCallback('elastic.in', ({ fraction }) => {
    return ((fraction == 0) ? 0 : ((fraction == 1) ? 1 : -Math.pow(2, 10 * fraction - 10) * Math.sin((fraction * 10 - 10.75) * ((2 * Math.PI) / 3))));
});
export function ElasticInAnimationEaseCompact() {
    AddAnimationEase(ElasticInAnimationEase);
}
export const ElasticOutAnimationEase = { name: `${ElasticAnimationEase.name}.out`, callback: ElasticAnimationEase.callback };
export function ElasticOutAnimationEaseCompact() {
    AddAnimationEase(ElasticOutAnimationEase);
}
export const ElasticInOutAnimationEase = CreateAnimationEaseCallback('elastic.in.out', ({ fraction }) => {
    if (fraction == 0 || fraction == 1) {
        return fraction;
    }
    const c1 = (2 * Math.PI) / 4.5;
    if (fraction < 0.5) {
        return (-(Math.pow(2, 20 * fraction - 10) * Math.sin((20 * fraction - 11.125) * c1)) / 2);
    }
    return ((Math.pow(2, -20 * fraction + 10) * Math.sin((20 * fraction - 11.125) * c1)) / 2 + 1);
});
export function ElasticInOutAnimationEaseCompact() {
    AddAnimationEase(ElasticInOutAnimationEase);
}
