import { GetGlobal, WaitForGlobal } from './global/get';

import { FavoritesCollectionConcept } from './concepts/collection/favorites';

import { FavoritesDirectiveHandlerCompact } from './directive/plugin/favorites';
import { FavoritesMagicHandlerCompact } from './magic/plugin/favorites';

WaitForGlobal().then(() => {
    const favConcept = new FavoritesCollectionConcept(GetGlobal().CreateComponent(document.createElement('template')));
    GetGlobal().SetConcept(favConcept.GetName(), favConcept);

    FavoritesDirectiveHandlerCompact();
    FavoritesMagicHandlerCompact();
});
