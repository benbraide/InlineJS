import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { BindEvent } from "../event";

export const CartDirectiveHandler = CreateDirectiveHandlerCallback('cart', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: 'cart',
        event: argKey,
        defaultEvent: 'update',
        eventWhitelist: ['item', 'import', 'clear'],
        options: [...argOptions, 'window'],
        optionBlacklist: ['document', 'outside'],
    });
});

export function CartDirectiveHandlerCompact(){
    AddDirectiveHandler(CartDirectiveHandler);
}
