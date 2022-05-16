import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { CartOffsetHandlerType, ICartCollectionConcept, ICollectionConcept } from "../../types/collection";
import { BuildCollectionMethods } from "./collection";

const CartCollectionConceptName = 'cart';

function CreateCartProxy(){
    const getCollectionConcept = () => GetGlobal().GetConcept<ICartCollectionConcept>(CartCollectionConceptName);
    let methods = {
        ...BuildCollectionMethods(CartCollectionConceptName),
        addOffset: (key: string, handler: CartOffsetHandlerType, initValue?: any) => {
            getCollectionConcept()?.AddOffset(key, handler, initValue);
        },
        removeOffset: (key: string) => {
            getCollectionConcept()?.RemoveOffset(key);
        },
        getOffset: (key: string) => {
            return getCollectionConcept()?.GetOffset(key);
        },
    };

    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && methods.hasOwnProperty(prop)){
                return methods[prop];
            }

            if (prop === 'keyed'){
                return (getCollectionConcept() as ICollectionConcept | null)?.GetKeyedProxy();
            }

            if (prop === 'items'){
                return (getCollectionConcept() as ICollectionConcept | null)?.GetItemProxies();
            }

            if (prop === 'count'){
                return (getCollectionConcept() as ICollectionConcept | null)?.GetCount();
            }

            if(prop){
                return getCollectionConcept()?.GetOffset(prop);
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
