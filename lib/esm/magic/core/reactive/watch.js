import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { UseEffect } from "../../../reactive/effect";
import { DeepCopy } from "../../../utilities/deep-copy";
import { IsEqual } from "../../../utilities/is-equal";
export const WatchMagicHandler = CreateMagicHandlerCallback('watch', ({ componentId, contextElement }) => {
    return (expression, callback) => {
        let evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true, waitPromise: 'none' }), firstEntry = true, lastValue = null;
        UseEffect({ componentId, contextElement, callback: () => {
                let value = evaluate(), result = null;
                if (!firstEntry && !IsEqual(value, lastValue)) {
                    result = callback(value);
                }
                firstEntry = false;
                lastValue = DeepCopy(value);
                return result;
            } });
    };
});
export function WatchMagicHandlerCompact() {
    AddMagicHandler(WatchMagicHandler);
}
