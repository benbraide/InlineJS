import { GetGlobal, WaitForGlobal } from './global/get';

import { RouterConcept } from './concepts/router';

import { RouterDirectiveHandlerCompact } from './directive/plugin/router';
import { RouterMagicHandlerCompact } from './magic/plugin/router';

WaitForGlobal().then(() => {
    GetGlobal().SetRouterConcept(new RouterConcept());

    RouterDirectiveHandlerCompact();
    RouterMagicHandlerCompact();
});
