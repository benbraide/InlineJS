import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
function CreateTimeDifferenceProxy() {
    let methods = {
        format: (params) => { var _a; return (_a = GetGlobal().GetConcept('tdiff')) === null || _a === void 0 ? void 0 : _a.Format(params); },
    };
    return CreateReadonlyProxy(methods);
}
const TimeDifferenceProxy = CreateTimeDifferenceProxy();
export const TimeDifferenceMagicHandler = CreateMagicHandlerCallback('tdiff', () => TimeDifferenceProxy);
export function TimeDifferenceMagicHandlerCompact() {
    AddMagicHandler(TimeDifferenceMagicHandler);
}
