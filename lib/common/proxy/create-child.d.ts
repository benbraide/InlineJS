import { IComponent } from "../types/component";
import { IProxy } from "../types/proxy";
export declare function CreateChildProxy(owner: IProxy | null, name: string, target: any, component?: IComponent): IProxy | null;
