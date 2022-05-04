import { GetGlobal, WaitForGlobal } from './global/get';

import { ScreenConcept } from './concepts/screen';

import { ScreenMagicHandlerCompact } from './magic/plugin/screen';

WaitForGlobal().then(() => {
    GetGlobal().SetScreenConcept(new ScreenConcept(GetGlobal().CreateComponent(document.createElement('template'))));
    ScreenMagicHandlerCompact();
});
