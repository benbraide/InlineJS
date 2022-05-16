import { ResourceConceptName } from "../../concepts/names";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
function CreateResourceProxy() {
    const getCollectionConcept = () => GetGlobal().GetConcept(ResourceConceptName);
    let methods = {
        get: (params) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Get(params); },
        getStyle: (path, concurrent, attributes) => {
            var _a;
            return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetStyle(path, concurrent, attributes);
        },
        getScript: (path, concurrent, attributes) => {
            var _a;
            return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetScript(path, concurrent, attributes);
        },
        getData: (path, concurrent, json) => {
            var _a;
            return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetData(path, concurrent, json);
        },
    };
    return CreateReadonlyProxy(methods);
}
const ResourceProxy = CreateResourceProxy();
export const ResourceMagicHandler = CreateMagicHandlerCallback(ResourceConceptName, () => ResourceProxy);
export function ResourceMagicHandlerCompact() {
    AddMagicHandler(ResourceMagicHandler);
}
