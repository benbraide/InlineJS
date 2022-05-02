import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { CartOffsetHandlerType, ICartCollectionConcept } from "../../types/collection";
import { BuildCollectionMethods } from "./collection";

const CartCollectionConceptName = 'cart';

function CreateCartProxy(){
    let methods = {
        ...BuildCollectionMethods(CartCollectionConceptName),
        addOffset: (key: string, handler: CartOffsetHandlerType, initValue?: any) => {
            (GetGlobal().GetCollectionConcept(CartCollectionConceptName) as ICartCollectionConcept | null)?.AddOffset(key, handler, initValue);
        },
        removeOffset: (key: string) => {
            (GetGlobal().GetCollectionConcept(CartCollectionConceptName) as ICartCollectionConcept | null)?.RemoveOffset(key);
        },
        getOffset: (key: string) => {
            return (GetGlobal().GetCollectionConcept(CartCollectionConceptName) as ICartCollectionConcept | null)?.GetOffset(key);
        },
    };

    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && methods.hasOwnProperty(prop)){
                return methods[prop];
            }

            if (prop === 'keyed'){
                return GetGlobal().GetCollectionConcept(CartCollectionConceptName)?.GetKeyedProxy();
            }

            if (prop === 'items'){
                return GetGlobal().GetCollectionConcept(CartCollectionConceptName)?.GetItemProxies();
            }

            if (prop === 'count'){
                return GetGlobal().GetCollectionConcept(CartCollectionConceptName)?.GetCount();
            }

            if(prop){
                return (GetGlobal().GetCollectionConcept(CartCollectionConceptName) as ICartCollectionConcept | null)?.GetOffset(prop);
            }
        },
        lookup: [...Object.keys(methods), 'keyed', 'items', 'count', 'subTotal', 'total'],
    }));
}

const CartProxy = CreateCartProxy();

export const CartMagicHandler = CreateMagicHandlerCallback(CartCollectionConceptName, () => CartProxy);

export function CartMagicHandlerCompact(){
    AddMagicHandler(CartMagicHandler);
}
