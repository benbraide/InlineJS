"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticInOutAnimationEaseCompact = exports.ElasticInOutAnimationEase = exports.ElasticOutAnimationEaseCompact = exports.ElasticOutAnimationEase = exports.ElasticInAnimationEaseCompact = exports.ElasticInAnimationEase = exports.ElasticAnimationEaseCompact = exports.ElasticAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.ElasticAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('elastic', ({ fraction }) => {
    return ((fraction == 0 || fraction == 1) ? fraction : (Math.pow(2, (-10 * fraction)) * Math.sin(((fraction * 10) - 0.75) * ((2 * Math.PI) / 3)) + 1));
});
function ElasticAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.ElasticAnimationEase);
}
exports.ElasticAnimationEaseCompact = ElasticAnimationEaseCompact;
exports.ElasticInAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('elastic.in', ({ fraction }) => {
    return ((fraction == 0) ? 0 : ((fraction == 1) ? 1 : -Math.pow(2, 10 * fraction - 10) * Math.sin((fraction * 10 - 10.75) * ((2 * Math.PI) / 3))));
});
function ElasticInAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.ElasticInAnimationEase);
}
exports.ElasticInAnimationEaseCompact = ElasticInAnimationEaseCompact;
exports.ElasticOutAnimationEase = { name: `${exports.ElasticAnimationEase.name}.out`, callback: exports.ElasticAnimationEase.callback };
function ElasticOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.ElasticOutAnimationEase);
}
exports.ElasticOutAnimationEaseCompact = ElasticOutAnimationEaseCompact;
exports.ElasticInOutAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('elastic.in.out', ({ fraction }) => {
    if (fraction == 0 || fraction == 1) {
        return fraction;
    }
    const c1 = (2 * Math.PI) / 4.5;
    if (fraction < 0.5) {
        return (-(Math.pow(2, 20 * fraction - 10) * Math.sin((20 * fraction - 11.125) * c1)) / 2);
    }
    return ((Math.pow(2, -20 * fraction + 10) * Math.sin((20 * fraction - 11.125) * c1)) / 2 + 1);
});
function ElasticInOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.ElasticInOutAnimationEase);
}
exports.ElasticInOutAnimationEaseCompact = ElasticInOutAnimationEaseCompact;
