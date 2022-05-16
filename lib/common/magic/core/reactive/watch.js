"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchMagicHandlerCompact = exports.WatchMagicHandler = void 0;
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
const effect_1 = require("../../../reactive/effect");
const deep_copy_1 = require("../../../utilities/deep-copy");
const is_equal_1 = require("../../../utilities/is-equal");
exports.WatchMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('watch', ({ componentId, contextElement }) => {
    return (expression, callback) => {
        let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true, waitPromise: 'none' }), firstEntry = true, lastValue = null;
        (0, effect_1.UseEffect)({ componentId, contextElement, callback: () => {
                let value = evaluate(), result = null;
                if (!firstEntry && !(0, is_equal_1.IsEqual)(value, lastValue)) {
                    result = callback(value);
                }
                firstEntry = false;
                lastValue = (0, deep_copy_1.DeepCopy)(value);
                return result;
            } });
    };
});
function WatchMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.WatchMagicHandler);
}
exports.WatchMagicHandlerCompact = WatchMagicHandlerCompact;
