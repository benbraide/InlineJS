import { CartOffsetHandlerType, ICartCollectionConcept, ICollectionOptions } from "../../types/collection";
import { IComponent } from "../../types/component";
import { CollectionConcept } from "./base";
export declare class CartCollectionConcept extends CollectionConcept implements ICartCollectionConcept {
    private offsets_;
    private offsetHandlers_;
    constructor(component?: IComponent, options?: ICollectionOptions);
    AddOffset(key: string, handler: CartOffsetHandlerType, initValue?: any): void;
    RemoveOffset(key: string): void;
    GetOffset(key: string): any;
    protected AlertUpdate_(): void;
}
