import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";

export const LocalsMagicHandler = CreateMagicHandlerCallback('locals', ({ componentId, component, contextElement }) => {
    return (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.GetLocals();
});

export function LocalsMagicHandlerCompact(){
    AddMagicHandler(LocalsMagicHandler);
}
