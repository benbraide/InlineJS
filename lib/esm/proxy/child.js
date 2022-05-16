import { GenericProxy } from "./generic";
export class ChildProxy extends GenericProxy {
    constructor(owner, name, target) {
        super(owner.GetComponentId(), target, name, owner);
    }
}
