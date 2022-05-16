"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildIntersectionOptions = void 0;
const is_object_1 = require("../../utilities/is-object");
const IntersectionThresholds = Array.from(Array(100).keys()).map(i => (i / 100));
function BuildIntersectionOptions(data) {
    let options = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
    };
    if ((0, is_object_1.IsObject)(data)) { //Overwrite applicable options
        Object.entries(options).forEach(([key, value]) => (options[key] = ((key in data && data[key]) || value)));
    }
    if (data.spread) {
        options.threshold = IntersectionThresholds;
    }
    return options;
}
exports.BuildIntersectionOptions = BuildIntersectionOptions;
