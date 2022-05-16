import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
export const CloakDirectiveHandler = CreateDirectiveHandlerCallback('cloak', () => { });
export function CloakDirectiveHandlerCompact() {
    AddDirectiveHandler(CloakDirectiveHandler);
}
