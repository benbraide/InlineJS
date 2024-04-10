import { InitComponentCache } from "../component/cache";
import { IConfigOptions } from "../types/config";
import { IGlobal } from "../types/global";
import { InitializeGlobalScope } from "../utilities/get-global-scope";
import { BaseGlobal } from "./base";
import { GetGlobal } from "./get";
import { GlobalCreatedEvent } from "./key";

export function CreateGlobal(configOptions?: IConfigOptions, idOffset = 0): IGlobal{
    const global = new BaseGlobal(configOptions, idOffset);
    
    InitComponentCache();
    InitializeGlobalScope('global', {
        base: global,
    });
    window.dispatchEvent(new CustomEvent(GlobalCreatedEvent));

    return global;
}

export function GetOrCreateGlobal(configOptions?: IConfigOptions, idOffset = 0): IGlobal{
    return (GetGlobal() || CreateGlobal(configOptions, idOffset));
}
