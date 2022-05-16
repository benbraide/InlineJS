import { GetGlobal, WaitForGlobal } from './global/get';

import { CartCollectionConcept } from './concepts/collection/cart';
import { FavoritesCollectionConcept } from './concepts/collection/favorites';

import { CartDirectiveHandlerCompact } from './directive/plugin/cart';
import { FavoritesDirectiveHandlerCompact } from './directive/plugin/favorites';

import { CartMagicHandlerCompact } from './magic/plugin/cart';
import { FavoritesMagicHandlerCompact } from './magic/plugin/favorites';

WaitForGlobal().then(() => {
    const cartCollection = new CartCollectionConcept(GetGlobal().CreateComponent(document.createElement('template')));
    const favCollection = new FavoritesCollectionConcept(GetGlobal().CreateComponent(document.createElement('template')));
    
    GetGlobal().SetConcept(cartCollection.GetName(), cartCollection);
    GetGlobal().SetConcept(favCollection.GetName(), favCollection);

    CartDirectiveHandlerCompact();
    FavoritesDirectiveHandlerCompact();

    CartMagicHandlerCompact();
    FavoritesMagicHandlerCompact();
});
