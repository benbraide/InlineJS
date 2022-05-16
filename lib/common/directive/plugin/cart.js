"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartDirectiveHandlerCompact = exports.CartDirectiveHandler = void 0;
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
const event_1 = require("../event");
exports.CartDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('cart', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    (0, event_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: 'cart',
        event: argKey,
        defaultEvent: 'update',
        eventWhitelist: ['item', 'import', 'clear'],
        options: [...argOptions, 'window'],
        optionBlacklist: ['document', 'outside'],
    });
});
function CartDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.CartDirectiveHandler);
}
exports.CartDirectiveHandlerCompact = CartDirectiveHandlerCompact;
