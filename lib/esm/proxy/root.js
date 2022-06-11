import { GenericProxy } from "./generic";
export class RootProxy extends GenericProxy {
    constructor(componentId, target, id) {
        super(componentId, target, `Proxy<${id || componentId}>`, undefined, !!id);
    }
}
