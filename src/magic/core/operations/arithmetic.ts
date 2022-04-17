import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { CreateReadonlyProxy } from "../../../proxy/create";
import { InitJITProxy } from "../../../proxy/jit";

export const ArithmeticMagicHandler = CreateMagicHandlerCallback('math', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('arithmetic', (component || FindComponentById(componentId)), contextElement);
    if (!elementKey || proxy){//Invalid context element OR proxy already exists
        return proxy;
    }

    let methods = {
        add: (...values: number[]) => values.reduce((acc, value) => (acc + value)),
        subtract: (...values: number[]) => values.reduce((acc, value) => (acc - value)),
        multiply: (...values: number[]) => values.reduce((acc, value) => (acc * value)),
        divide: (...values: number[]) => values.reduce((acc, value) => (acc / value)),
    };
    
    return (scope![elementKey] = CreateReadonlyProxy(methods));
});

export function ArithmeticMagicHandlerCompact(){
    AddMagicHandler(ArithmeticMagicHandler);
}
