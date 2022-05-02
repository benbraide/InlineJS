import { GetGlobal, WaitForGlobal } from './global/get';

import { FavoritesCollectionConcept } from './concepts/collection/favorites';

import { FavoritesDirectiveHandlerCompact } from './directive/plugin/favorites';
import { FavoritesMagicHandlerCompact } from './magic/plugin/favorites';

WaitForGlobal().then(() => {
    GetGlobal().SetCollectionConcept(new FavoritesCollectionConcept(GetGlobal().CreateComponent(document.createElement('template'))));

    FavoritesDirectiveHandlerCompact();
    FavoritesMagicHandlerCompact();
});
