import { FindComponentById } from "../../component/find";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { InitJITProxy } from "../../proxy/jit";

export const ClassMagicHandler = CreateMagicHandlerCallback('class', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('class', (component || FindComponentById(componentId)), contextElement);
    if (!elementKey || proxy){//Invalid context element OR proxy already exists
        return proxy;
    }

    let methods = {
        add: (...values: string[]) => contextElement.classList.add(...values),
        remove: (...values: string[]) => contextElement.classList.remove(...values.filter(value => contextElement.classList.contains(value))),
        toggle: (...values: string[]) => values.map(value => contextElement.classList.toggle(value)),
        set: (...values: string[]) => (contextElement.className = values.join(' ')),
        contains: (...values: string[]) => (values.findIndex(value => !contextElement.classList.contains(value)) == -1),
    };
    
    return (scope![elementKey] = CreateReadonlyProxy(methods));
});

export function ClassMagicHandlerCompact(){
    AddMagicHandler(ClassMagicHandler);
}
