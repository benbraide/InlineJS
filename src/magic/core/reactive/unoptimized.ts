import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";

export const UnoptimizedMagicHandler = CreateMagicHandlerCallback('unoptimized', ({ componentId }) => {
    return (value: any) => {
        FindComponentById(componentId)?.GetBackend().changes.RestoreOptimizedGetAccessStorage();
        return value;
    }
}, ({ componentId, component }) => (component || FindComponentById(componentId))?.GetBackend().changes.SwapOptimizedGetAccessStorage());

export function UnoptimizedMagicHandlerCompact(){
    AddMagicHandler(UnoptimizedMagicHandler);
}
