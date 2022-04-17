import { IProxy } from "../types/proxy";
import { GenericProxy } from "./generic";

export class ChildProxy extends GenericProxy{
    public constructor(owner: IProxy, name: string, target: any){
        super(owner.GetComponentId(), target, name, owner);
    }
}
