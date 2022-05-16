import { ResourceConceptName } from "../../concepts/names";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { IResourceConcept, IResourceGetParams } from "../../types/resource";

function CreateResourceProxy(){
    const getCollectionConcept = () => GetGlobal().GetConcept<IResourceConcept>(ResourceConceptName);
    let methods = {
        get: (params: IResourceGetParams) => getCollectionConcept()?.Get(params),
        getStyle: (path: string | Array<string>, concurrent?: boolean, attributes?: Record<string, string>) => {
            return getCollectionConcept()?.GetStyle(path, concurrent, attributes);
        },
        getScript: (path: string | Array<string>, concurrent?: boolean, attributes?: Record<string, string>) => {
            return getCollectionConcept()?.GetScript(path, concurrent, attributes);
        },
        getData: (path: string | Array<string>, concurrent?: boolean, json?: boolean) => {
            return getCollectionConcept()?.GetData(path, concurrent, json);
        },
    };

    return CreateReadonlyProxy(methods);
}

const ResourceProxy = CreateResourceProxy();

export const ResourceMagicHandler = CreateMagicHandlerCallback(ResourceConceptName, () => ResourceProxy);

export function ResourceMagicHandlerCompact(){
    AddMagicHandler(ResourceMagicHandler);
}
