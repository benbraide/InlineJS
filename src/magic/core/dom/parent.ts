import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";

export const ParentMagicHandler = CreateMagicHandlerCallback('parent', ({ componentId, component, contextElement }) => {
    return (component || FindComponentById(componentId))?.FindAncestor(contextElement, 0);
});

export function ParentMagicHandlerCompact(){
    AddMagicHandler(ParentMagicHandler);
}
