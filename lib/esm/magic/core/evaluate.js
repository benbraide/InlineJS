import { EvaluateLater } from "../../evaluator/evaluate-later";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
export const FunctionMagicHandler = CreateMagicHandlerCallback('func', ({ componentId, contextElement }) => {
    return (expression) => EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true });
});
export const EvaluateMagicHandler = CreateMagicHandlerCallback('eval', ({ componentId, contextElement }) => {
    return (expression, callback) => EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true })(callback);
});
export function EvaluateMagicHandlerCompact() {
    AddMagicHandler(FunctionMagicHandler);
    AddMagicHandler(EvaluateMagicHandler);
}
