import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { CreateReadonlyProxy } from "../../../proxy/create";
import { InitJITProxy } from "../../../proxy/jit";

export const LogicalMagicHandler = CreateMagicHandlerCallback('log', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('logical', (component || FindComponentById(componentId)), contextElement);
    if (!elementKey || proxy){//Invalid context element OR proxy already exists
        return proxy;
    }

    let methods = {
        or: (...values: any[]) => values.at(values.findIndex(value => !!value)),
        and: (...values: any[]) => values.at(values.findIndex(value => !value)),
    };
    
    return (scope![elementKey] = CreateReadonlyProxy(methods));
});

export function LogicalMagicHandlerCompact(){
    AddMagicHandler(LogicalMagicHandler);
}
