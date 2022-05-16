import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { BindEvent } from "../event";
export const FavoritesDirectiveHandler = CreateDirectiveHandlerCallback('favorites', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: 'favorites',
        event: argKey,
        defaultEvent: 'update',
        eventWhitelist: ['item', 'import', 'clear'],
        options: [...argOptions, 'window'],
        optionBlacklist: ['document', 'outside'],
    });
});
export function FavoritesDirectiveHandlerCompact() {
    AddDirectiveHandler(FavoritesDirectiveHandler);
}
