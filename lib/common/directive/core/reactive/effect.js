"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectDirectiveHandlerCompact = exports.EffectDirectiveHandler = void 0;
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
const effect_1 = require("../../../reactive/effect");
exports.EffectDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('effect', ({ componentId, contextElement, expression }) => {
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true });
    (0, effect_1.UseEffect)({ componentId, contextElement,
        callback: () => evaluate(),
    });
});
function EffectDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.EffectDirectiveHandler);
}
exports.EffectDirectiveHandlerCompact = EffectDirectiveHandlerCompact;
