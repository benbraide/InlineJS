import { AddDirectiveHandler } from "../../../directives/add";
import { CreateSelectionDirectiveHandler } from "./selection";
export const IfDirectiveHandler = CreateSelectionDirectiveHandler(false);
export function IfDirectiveHandlerCompact() {
    AddDirectiveHandler(IfDirectiveHandler);
}
