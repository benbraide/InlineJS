import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { CreateReadonlyProxy } from "../../../proxy/create";
import { InitJITProxy } from "../../../proxy/jit";

export const RelationalMagicHandler = CreateMagicHandlerCallback('rel', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('arithmetic', (component || FindComponentById(componentId)), contextElement);
    if (!elementKey || proxy){//Invalid context element OR proxy already exists
        return proxy;
    }

    let methods = {
        comp: (first: any, second: any) => ((first < second) ? -1 : ((first == second) ? 0 : 1)),
        lt: (first: any, second: any) => (first < second),
        le: (first: any, second: any) => (first <= second),
        eq: (first: any, second: any) => (first == second),
        eqs: (first: any, second: any) => (first === second),
        nes: (first: any, second: any) => (first !== second),
        ne: (first: any, second: any) => (first != second),
        ge: (first: any, second: any) => (first >= second),
        gt: (first: any, second: any) => (first > second),
    };
    
    return (scope![elementKey] = CreateReadonlyProxy(methods));
});

export function RelationalMagicHandlerCompact(){
    AddMagicHandler(RelationalMagicHandler);
}
