import { GetGlobal, WaitForGlobal } from './global/get';

import { CartCollectionConcept } from './concepts/collection/cart';
import { FavoritesCollectionConcept } from './concepts/collection/favorites';

import { CartDirectiveHandlerCompact } from './directive/plugin/cart';
import { FavoritesDirectiveHandlerCompact } from './directive/plugin/favorites';

import { CartMagicHandlerCompact } from './magic/plugin/cart';
import { FavoritesMagicHandlerCompact } from './magic/plugin/favorites';

WaitForGlobal().then(() => {
    GetGlobal().SetCollectionConcept(new CartCollectionConcept(GetGlobal().CreateComponent(document.createElement('template'))));
    GetGlobal().SetCollectionConcept(new FavoritesCollectionConcept(GetGlobal().CreateComponent(document.createElement('template'))));

    CartDirectiveHandlerCompact();
    FavoritesDirectiveHandlerCompact();

    CartMagicHandlerCompact();
    FavoritesMagicHandlerCompact();
});
