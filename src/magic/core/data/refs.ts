import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../../proxy/create";
import { InitJITProxy } from "../../../proxy/jit";

export const RefsMagicHandler = CreateMagicHandlerCallback('refs', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('refs', (component || FindComponentById(componentId)), contextElement);
    if (!elementKey || proxy){//Invalid context element OR proxy already exists
        return proxy;
    }
    
    return (scope![elementKey] = CreateInplaceProxy(BuildGetterProxyOptions({
        getter: name => (name && FindComponentById(componentId)?.FindRefElement(name)),
        lookup: () => true,
    })));
});

export function RefsMagicHandlerCompact(){
    AddMagicHandler(RefsMagicHandler);
}
