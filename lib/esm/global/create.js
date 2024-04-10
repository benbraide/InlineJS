import { InitComponentCache } from "../component/cache";
import { InitializeGlobalScope } from "../utilities/get-global-scope";
import { BaseGlobal } from "./base";
import { GetGlobal } from "./get";
import { GlobalCreatedEvent } from "./key";
export function CreateGlobal(configOptions, idOffset = 0) {
    const global = new BaseGlobal(configOptions, idOffset);
    InitComponentCache();
    InitializeGlobalScope('global', {
        base: global,
    });
    window.dispatchEvent(new CustomEvent(GlobalCreatedEvent));
    return global;
}
export function GetOrCreateGlobal(configOptions, idOffset = 0) {
    return (GetGlobal() || CreateGlobal(configOptions, idOffset));
}
