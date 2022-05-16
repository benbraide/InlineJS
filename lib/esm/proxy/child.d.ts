import { IProxy } from "../types/proxy";
import { GenericProxy } from "./generic";
export declare class ChildProxy extends GenericProxy {
    constructor(owner: IProxy, name: string, target: any);
}
