import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { ICollectionConcept } from "../../types/collection";
import { BuildCollectionMethods } from "./collection";

const FavoritesCollectionConceptName = 'favorites';

function CreateFavoritesProxy(){
    let methods = BuildCollectionMethods(FavoritesCollectionConceptName);

    const getCollectionConcept = () => GetGlobal().GetConcept<ICollectionConcept>(FavoritesCollectionConceptName);

    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && methods.hasOwnProperty(prop)){
                return methods[prop];
            }

            if (prop === 'keyed'){
                return getCollectionConcept()?.GetKeyedProxy();
            }

            if (prop === 'items'){
                return getCollectionConcept()?.GetItemProxies();
            }

            if (prop === 'count'){
                return getCollectionConcept()?.GetCount();
            }
        },
        lookup: [...Object.keys(methods), 'keyed', 'items', 'count'],
    }));
}

const FavoritesProxy = CreateFavoritesProxy();

export const FavoritesMagicHandler = CreateMagicHandlerCallback(FavoritesCollectionConceptName, () => FavoritesProxy);

export function FavoritesMagicHandlerCompact(){
    AddMagicHandler(FavoritesMagicHandler);
}
