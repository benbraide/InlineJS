import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../../proxy/create";

export const ScopeMagicHandler = CreateMagicHandlerCallback('scope', ({ componentId, component, contextElement }) => {
    return (component || FindComponentById(componentId))?.InferScopeFrom(contextElement);
});

export const ScopesMagicHandler = CreateMagicHandlerCallback('scopes', ({ componentId }) => {
    return CreateInplaceProxy(BuildGetterProxyOptions({ getter: prop => FindComponentById(componentId)?.FindScopeByName(prop!), lookup: () => true}));
});

export function ScopeMagicHandlerCompact(){
    AddMagicHandler(ScopeMagicHandler);
    AddMagicHandler(ScopesMagicHandler);
}
