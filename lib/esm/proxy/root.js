import { GenericProxy } from "./generic";
export class RootProxy extends GenericProxy {
    constructor(componentId, target) {
        super(componentId, target, `Proxy<${componentId}>`);
    }
}
