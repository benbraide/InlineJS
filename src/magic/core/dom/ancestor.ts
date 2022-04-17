import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";

export const AncestorMagicHandler = CreateMagicHandlerCallback('ancestor', ({ componentId, component, contextElement }) => {
    return (index?: number) => (component || FindComponentById(componentId))?.FindAncestor(contextElement, (index || 0));
});

export function AncestorMagicHandlerCompact(){
    AddMagicHandler(AncestorMagicHandler);
}
