import { GetGlobal, WaitForGlobal } from './global/get';

import { CartCollectionConcept } from './concepts/collection/cart';

import { CartDirectiveHandlerCompact } from './directive/plugin/cart';
import { CartMagicHandlerCompact } from './magic/plugin/cart';

WaitForGlobal().then(() => {
    GetGlobal().SetCollectionConcept(new CartCollectionConcept(GetGlobal().CreateComponent(document.createElement('template'))));

    CartDirectiveHandlerCompact();
    CartMagicHandlerCompact();
});
