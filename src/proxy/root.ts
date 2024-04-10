import { GenericProxy } from "./generic";

export class RootProxy extends GenericProxy{
    public constructor(componentId: string, target: any, id?: string){
        super(componentId, target, `Proxy<${id || componentId}>`, undefined, id);
    }
}
