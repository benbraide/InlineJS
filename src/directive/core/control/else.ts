import { AddDirectiveHandler } from "../../../directives/add";
import { CreateSelectionDirectiveHandler } from "./selection";

export const ElseDirectiveHandler = CreateSelectionDirectiveHandler(true);

export function ElseDirectiveHandlerCompact(){
    AddDirectiveHandler(ElseDirectiveHandler);
}
