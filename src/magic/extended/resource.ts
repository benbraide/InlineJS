import { ResourceConceptName } from "../../concepts/names";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { IResourceGetParams } from "../../types/resource";

function CreateResourceProxy(){
    let methods = {
        get: (params: IResourceGetParams) => GetGlobal().GetResourceConcept()?.Get(params),
        getStyle: (path: string | Array<string>, concurrent?: boolean, attributes?: Record<string, string>) => {
            return GetGlobal().GetResourceConcept()?.GetStyle(path, concurrent, attributes);
        },
        getScript: (path: string | Array<string>, concurrent?: boolean, attributes?: Record<string, string>) => {
            return GetGlobal().GetResourceConcept()?.GetScript(path, concurrent, attributes);
        },
        getData: (path: string | Array<string>, concurrent?: boolean, json?: boolean) => {
            return GetGlobal().GetResourceConcept()?.GetData(path, concurrent, json);
        },
    };

    return CreateReadonlyProxy(methods);
}

const ResourceProxy = CreateResourceProxy();

export const ResourceMagicHandler = CreateMagicHandlerCallback(ResourceConceptName, () => ResourceProxy);

export function ResourceMagicHandlerCompact(){
    AddMagicHandler(ResourceMagicHandler);
}
