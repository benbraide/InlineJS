import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";

export const PickMagicHandler = CreateMagicHandlerCallback('pick', () => {
    return (pred: any, trueValue: any, falseValue: any) => (!!pred ? trueValue : falseValue);
});

export function PickMagicHandlerCompact(){
    AddMagicHandler(PickMagicHandler);
}
