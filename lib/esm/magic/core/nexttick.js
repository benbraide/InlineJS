import { FindComponentById } from "../../component/find";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
export const NextTickMagicHandler = CreateMagicHandlerCallback('nextTick', ({ componentId }) => {
    return (callback) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(callback); };
});
export function NextTickMagicHandlerCompact() {
    AddMagicHandler(NextTickMagicHandler);
}
