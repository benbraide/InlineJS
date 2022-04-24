import { InitComponentCache } from "../component/find";
import { IConfigOptions } from "../types/config";
import { IGlobal } from "../types/global";
import { BaseGlobal } from "./base";
import { GetGlobal, GlobalCreatedEvent } from "./get";

export const InlineJSGlobalKey = '__InlineJS_GLOBAL_KEY__';

export function CreateGlobal(configOptions?: IConfigOptions, idOffset = 0): IGlobal{
    InitComponentCache();
    globalThis[InlineJSGlobalKey] = new BaseGlobal(configOptions, idOffset);
    window.dispatchEvent(new CustomEvent(GlobalCreatedEvent));
    return globalThis[InlineJSGlobalKey];
}

export function GetOrCreateGlobal(configOptions?: IConfigOptions, idOffset = 0): IGlobal{
    return (GetGlobal() || CreateGlobal(configOptions, idOffset));
}
