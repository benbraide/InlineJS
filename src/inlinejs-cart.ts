import { GetGlobal, WaitForGlobal } from './global/get';

import { CartCollectionConcept } from './concepts/collection/cart';

import { CartDirectiveHandlerCompact } from './directive/plugin/cart';
import { CartMagicHandlerCompact } from './magic/plugin/cart';

WaitForGlobal().then(() => {
    const cartConcept = new CartCollectionConcept(GetGlobal().CreateComponent(document.createElement('template')));
    GetGlobal().SetConcept(cartConcept.GetName(), cartConcept);

    CartDirectiveHandlerCompact();
    CartMagicHandlerCompact();
});
