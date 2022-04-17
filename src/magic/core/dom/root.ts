import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";

export const RootMagicHandler = CreateMagicHandlerCallback('root', ({ componentId, component }) => {
    return (component || FindComponentById(componentId))?.GetRoot();
});

export function RootMagicHandlerCompact(){
    AddMagicHandler(RootMagicHandler);
}
