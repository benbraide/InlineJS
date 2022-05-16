import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { IAlertConcept } from "../../types/alert";

function CreateAlertProxy(){
    const getCollectionConcept = () => GetGlobal().GetConcept<IAlertConcept>('alert');
    let methods = {
        notify: (options: any) => getCollectionConcept()?.Notify(options),
        confirm: (options: any) => getCollectionConcept()?.Confirm(options),
        prompt: (options: any) => getCollectionConcept()?.Prompt(options),
    };
    
    return CreateReadonlyProxy(methods);
}

const AlertProxy = CreateAlertProxy();

export const AlertMagicHandler = CreateMagicHandlerCallback('alert', () => AlertProxy);

export function AlertMagicHandlerCompact(){
    AddMagicHandler(AlertMagicHandler);
}
