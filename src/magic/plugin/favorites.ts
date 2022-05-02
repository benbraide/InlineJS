import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { BuildCollectionMethods } from "./collection";

const FavoritesCollectionConceptName = 'favorites';

function CreateFavoritesProxy(){
    let methods = BuildCollectionMethods(FavoritesCollectionConceptName);

    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && methods.hasOwnProperty(prop)){
                return methods[prop];
            }

            if (prop === 'keyed'){
                return GetGlobal().GetCollectionConcept(FavoritesCollectionConceptName)?.GetKeyedProxy();
            }

            if (prop === 'items'){
                return GetGlobal().GetCollectionConcept(FavoritesCollectionConceptName)?.GetItemProxies();
            }

            if (prop === 'count'){
                return GetGlobal().GetCollectionConcept(FavoritesCollectionConceptName)?.GetCount();
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
