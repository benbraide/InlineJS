import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";

function CreateAlertProxy(){
    let methods = {
        notify: (options: any) => GetGlobal().GetAlertConcept()?.Notify(options),
        confirm: (options: any) => GetGlobal().GetAlertConcept()?.Confirm(options),
        prompt: (options: any) => GetGlobal().GetAlertConcept()?.Prompt(options),
    };
    
    return CreateReadonlyProxy(methods);
}

const AlertProxy = CreateAlertProxy();

export const AlertMagicHandler = CreateMagicHandlerCallback('alert', () => AlertProxy);

export function AlertMagicHandlerCompact(){
    AddMagicHandler(AlertMagicHandler);
}
