import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { GetTarget } from "../../../utilities/get-target";
import { IsObject } from "../../../utilities/is-object";
export const LocalsDirectiveHandler = CreateDirectiveHandlerCallback('locals', ({ componentId, contextElement, expression }) => {
    EvaluateLater({ componentId, contextElement, expression })((data) => {
        var _a;
        let elementScope = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement);
        data = GetTarget(data);
        data = ((IsObject(data) && data) || {});
        Object.entries(data).forEach(([key, value]) => elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(key, value));
    });
});
export function LocalsDirectiveHandlerCompact() {
    AddDirectiveHandler(LocalsDirectiveHandler);
}
