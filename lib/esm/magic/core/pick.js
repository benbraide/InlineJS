import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
export const PickMagicHandler = CreateMagicHandlerCallback('pick', () => {
    return (pred, trueValue, falseValue) => (!!pred ? trueValue : falseValue);
});
export function PickMagicHandlerCompact() {
    AddMagicHandler(PickMagicHandler);
}
