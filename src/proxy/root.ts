import { GenericProxy } from "./generic";

export class RootProxy extends GenericProxy{
    public constructor(componentId: string, target: any){
        super(componentId, target, `Proxy<${componentId}>`);
    }
}
