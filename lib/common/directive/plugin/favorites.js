"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesDirectiveHandlerCompact = exports.FavoritesDirectiveHandler = void 0;
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
const event_1 = require("../event");
exports.FavoritesDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('favorites', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    (0, event_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: 'favorites',
        event: argKey,
        defaultEvent: 'update',
        eventWhitelist: ['item', 'import', 'clear'],
        options: [...argOptions, 'window'],
        optionBlacklist: ['document', 'outside'],
    });
});
function FavoritesDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.FavoritesDirectiveHandler);
}
exports.FavoritesDirectiveHandlerCompact = FavoritesDirectiveHandlerCompact;
