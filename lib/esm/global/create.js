import { InitComponentCache } from "../component/find";
import { BaseGlobal } from "./base";
import { GetGlobal, GlobalCreatedEvent } from "./get";
export const InlineJSGlobalKey = '__InlineJS_GLOBAL_KEY__';
export function CreateGlobal(configOptions, idOffset = 0) {
    InitComponentCache();
    globalThis[InlineJSGlobalKey] = new BaseGlobal(configOptions, idOffset);
    (globalThis['InlineJS'] = (globalThis['InlineJS'] || {}))['global'] = globalThis[InlineJSGlobalKey];
    window.dispatchEvent(new CustomEvent(GlobalCreatedEvent));
    return globalThis[InlineJSGlobalKey];
}
export function GetOrCreateGlobal(configOptions, idOffset = 0) {
    return (GetGlobal() || CreateGlobal(configOptions, idOffset));
}
