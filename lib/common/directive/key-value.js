"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveKeyValue = void 0;
const evaluate_later_1 = require("../evaluator/evaluate-later");
const stream_data_1 = require("../evaluator/stream-data");
const effect_1 = require("../reactive/effect");
const is_object_1 = require("../utilities/is-object");
function ResolveKeyValue({ componentId, contextElement, key, expression, callback, arrayCallback, useEffect = true }) {
    let checkpoint = 0, evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression }), resolve = (value, myCheckpoint) => {
        (0, stream_data_1.StreamData)(value, (value) => {
            if (myCheckpoint != checkpoint) {
                return;
            }
            if (key) {
                callback([key, value]);
            }
            else if ((0, is_object_1.IsObject)(value)) {
                Object.entries(value).forEach(callback);
            }
            else if (arrayCallback && (typeof value === 'string' || Array.isArray(value))) {
                arrayCallback((typeof value === 'string') ? value.trim().split(' ').filter(item => !!item) : value);
            }
        });
    };
    if (useEffect) {
        (0, effect_1.UseEffect)({ componentId, contextElement,
            callback: () => evaluate(value => resolve(value, ++checkpoint)),
        });
    }
    else { //No effect
        evaluate(value => resolve(value, checkpoint));
    }
}
exports.ResolveKeyValue = ResolveKeyValue;
