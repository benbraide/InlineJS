import { WaitPromise } from "../../../evaluator/wait-promise";
import { WaitWhile } from "../../../evaluator/wait-while";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
export const WaitMagicHandler = CreateMagicHandlerCallback('wait', () => {
    return (value, callback) => WaitPromise(value, value => WaitWhile(value, callback, callback));
});
export function WaitMagicHandlerCompact() {
    AddMagicHandler(WaitMagicHandler);
}
