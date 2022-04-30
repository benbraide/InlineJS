import { WaitForGlobal } from './global/get';

import { IntersectionDirectiveHandlerCompact } from './directive/extended/intersection';
import { TickDirectiveHandlerCompact } from './directive/extended/tick';
import { FormDirectiveHandlerCompact } from './directive/extended/form';
import { OverlayDirectiveHandlerCompact } from './directive/extended/overlay';

import { FormatMagicHandlerCompact } from './magic/extended/format';
import { FetchMagicHandlerCompact } from './magic/extended/fetch';
import { OverlayMagicHandlerCompact } from './magic/extended/overlay';

WaitForGlobal().then(() => {
    IntersectionDirectiveHandlerCompact();
    TickDirectiveHandlerCompact();
    FormDirectiveHandlerCompact();
    OverlayDirectiveHandlerCompact();

    FormatMagicHandlerCompact();
    FetchMagicHandlerCompact();
    OverlayMagicHandlerCompact();
});
