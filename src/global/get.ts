import { IGlobal } from "../types/global";
import { InlineJSGlobalKey } from "./create";

export function GetGlobal(): IGlobal{
    return globalThis[InlineJSGlobalKey];
}
