import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
export const LocalsMagicHandler = CreateMagicHandlerCallback('locals', ({ componentId, component, contextElement }) => {
    var _a, _b;
    return (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetLocals();
});
export function LocalsMagicHandlerCompact() {
    AddMagicHandler(LocalsMagicHandler);
}
