import { GetGlobal, WaitForGlobal } from './global/get';

import { RouterConcept } from './concepts/router';

import { RouterDirectiveHandlerCompact } from './directive/plugin/router';
import { RouterMagicHandlerCompact } from './magic/plugin/router';
import { RouterConceptName } from './concepts/names';

WaitForGlobal().then(() => {
    GetGlobal().SetConcept(RouterConceptName, new RouterConcept());

    RouterDirectiveHandlerCompact();
    RouterMagicHandlerCompact();
});
