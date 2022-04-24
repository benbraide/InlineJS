import { WaitForGlobal } from './global/get';

import { IntersectionDirectiveHandlerCompact } from './directive/extended/intersection';
import { TickDirectiveHandlerCompact } from './directive/extended/tick';
import { FormDirectiveHandlerCompact } from './directive/extended/form';

import { FormatMagicHandlerCompact } from './magic/extended/format';

WaitForGlobal().then(() => {
    IntersectionDirectiveHandlerCompact();
    TickDirectiveHandlerCompact();
    FormDirectiveHandlerCompact();

    FormatMagicHandlerCompact();
});
