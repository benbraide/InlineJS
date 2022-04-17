import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";

export const ProxyMagicHandler = CreateMagicHandlerCallback('proxy', ({ componentId, component }) => {
    return (component || FindComponentById(componentId))?.GetRootProxy().GetNative();
});

export function ProxyMagicHandlerCompact(){
    AddMagicHandler(ProxyMagicHandler);
}
