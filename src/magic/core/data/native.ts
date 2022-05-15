import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { GetTarget } from "../../../utilities/get-target";

export const NativeMagicHandler = CreateMagicHandlerCallback('ancestor', () => GetTarget);

export function NativeMagicHandlerCompact(){
    AddMagicHandler(NativeMagicHandler);
}
