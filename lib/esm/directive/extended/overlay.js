import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { GetGlobal } from "../../global/get";
import { UseEffect } from "../../reactive/effect";
import { BindEvent } from "../event";
export const OverlayDirectiveHandler = CreateDirectiveHandlerCallback('overlay', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
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
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), state = false;
    UseEffect({ componentId, contextElement,
        callback: () => evaluate((value) => {
            if (!!value != state) {
                state = !state;
                let handler = GetGlobal().GetMagicManager().FindHandler('overlay');
                if (handler) {
                    handler({ componentId, contextElement }).offsetShowCount(state ? 1 : -1);
                }
            }
        }),
    });
});
export function OverlayDirectiveHandlerCompact() {
    AddDirectiveHandler(OverlayDirectiveHandler);
}
