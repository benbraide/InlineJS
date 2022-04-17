import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { UseEffect } from "../../../reactive/effect";

export const EffectDirectiveHandler = CreateDirectiveHandlerCallback('effect', ({ componentId, contextElement, expression }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true });
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(),
    });
});

export function EffectDirectiveHandlerCompact(){
    AddDirectiveHandler(EffectDirectiveHandler);
}
