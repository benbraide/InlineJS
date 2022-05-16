import { StreamData } from "../../../evaluator/stream-data";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
export const StreamMagicHandler = CreateMagicHandlerCallback('stream', () => {
    return (value, callback) => StreamData(value, callback);
});
export function StreamMagicHandlerCompact() {
    AddMagicHandler(StreamMagicHandler);
}
