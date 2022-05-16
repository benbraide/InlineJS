import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
export const ProxyMagicHandler = CreateMagicHandlerCallback('proxy', ({ componentId, component }) => {
    var _a;
    return (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative();
});
export function ProxyMagicHandlerCompact() {
    AddMagicHandler(ProxyMagicHandler);
}
