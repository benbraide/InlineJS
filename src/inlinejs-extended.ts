import { WaitForGlobal } from './global/get';

import { AttrDirectiveHandlerCompact } from './directive/extended/attr';
import { IntersectionDirectiveHandlerCompact } from './directive/extended/intersection';
import { TickDirectiveHandlerCompact } from './directive/extended/tick';
import { FormDirectiveHandlerCompact } from './directive/extended/form';
import { OverlayDirectiveHandlerCompact } from './directive/extended/overlay';
import { MouseDirectiveHandlerCompact } from './directive/extended/mouse';
import { KeyboardDirectiveHandlerCompact } from './directive/extended/keyboard';

import { FormatMagicHandlerCompact } from './magic/extended/format';
import { GetMagicHandlerCompact } from './magic/extended/get';
import { FetchMagicHandlerCompact } from './magic/extended/fetch';
import { OverlayMagicHandlerCompact } from './magic/extended/overlay';

WaitForGlobal().then(() => {
    AttrDirectiveHandlerCompact();
    IntersectionDirectiveHandlerCompact();
    TickDirectiveHandlerCompact();
    FormDirectiveHandlerCompact();
    OverlayDirectiveHandlerCompact();
    MouseDirectiveHandlerCompact();
    KeyboardDirectiveHandlerCompact();

    FormatMagicHandlerCompact();
    GetMagicHandlerCompact();
    FetchMagicHandlerCompact();
    OverlayMagicHandlerCompact();
});
