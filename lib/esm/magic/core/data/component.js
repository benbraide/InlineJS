import { FindComponentById, FindComponentByName } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
export const ComponentMagicHandler = CreateMagicHandlerCallback('component', () => (name) => { var _a; return (_a = FindComponentByName(name)) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative(); });
export const ComponentNameMagicHandler = CreateMagicHandlerCallback('name', ({ componentId, component }) => { var _a; return (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.GetName(); });
export function ComponentMagicHandlerCompact() {
    AddMagicHandler(ComponentMagicHandler);
    AddMagicHandler(ComponentNameMagicHandler);
}
