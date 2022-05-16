import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
function CreateAlertProxy() {
    const getCollectionConcept = () => GetGlobal().GetConcept('alert');
    let methods = {
        notify: (options) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Notify(options); },
        confirm: (options) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Confirm(options); },
        prompt: (options) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Prompt(options); },
    };
    return CreateReadonlyProxy(methods);
}
const AlertProxy = CreateAlertProxy();
export const AlertMagicHandler = CreateMagicHandlerCallback('alert', () => AlertProxy);
export function AlertMagicHandlerCompact() {
    AddMagicHandler(AlertMagicHandler);
}
