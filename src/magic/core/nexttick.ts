import { FindComponentById } from "../../component/find";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";

export const NextTickMagicHandler = CreateMagicHandlerCallback('nextTick', ({ componentId }) => {
    return (callback: () => void) => FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(callback);
});

export function NextTickMagicHandlerCompact(){
    AddMagicHandler(NextTickMagicHandler);
}
