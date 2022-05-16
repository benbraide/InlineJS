"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayDirectiveHandlerCompact = exports.OverlayDirectiveHandler = void 0;
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
const evaluate_later_1 = require("../../evaluator/evaluate-later");
const get_1 = require("../../global/get");
const effect_1 = require("../../reactive/effect");
const event_1 = require("../event");
exports.OverlayDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('overlay', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if ((0, event_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: 'overlay',
        event: argKey,
        defaultEvent: 'visible',
        eventWhitelist: ['visibility', 'hidden', 'click'],
        options: [...argOptions, 'window'],
        optionBlacklist: ['document', 'outside'],
    })) {
        return;
    }
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression }), state = false;
    (0, effect_1.UseEffect)({ componentId, contextElement,
        callback: () => evaluate((value) => {
            if (!!value != state) {
                state = !state;
                let handler = (0, get_1.GetGlobal)().GetMagicManager().FindHandler('overlay');
                if (handler) {
                    handler({ componentId, contextElement }).offsetShowCount(state ? 1 : -1);
                }
            }
        }),
    });
});
function OverlayDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.OverlayDirectiveHandler);
}
exports.OverlayDirectiveHandlerCompact = OverlayDirectiveHandlerCompact;
