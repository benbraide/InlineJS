import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";

export const StaticDirectiveHandler = CreateDirectiveHandlerCallback('static', ({ componentId, contextElement, expression }) => {
    EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true })();
});

export function StaticDirectiveHandlerCompact(){
    AddDirectiveHandler(StaticDirectiveHandler);
}
