import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { ITimeDifferenceFormatParams } from "../../types/time-diff";

function CreateTimeDifferenceProxy(){
    let methods = {
        format: (params: ITimeDifferenceFormatParams) => GetGlobal().GetTimeDifferenceConcept()?.Format(params),
    };

    return CreateReadonlyProxy(methods);
}

const TimeDifferenceProxy = CreateTimeDifferenceProxy();

export const TimeDifferenceMagicHandler = CreateMagicHandlerCallback('tdiff', () => TimeDifferenceProxy);

export function TimeDifferenceMagicHandlerCompact(){
    AddMagicHandler(TimeDifferenceMagicHandler);
}
