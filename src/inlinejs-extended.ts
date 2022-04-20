import { GetOrCreateGlobal } from './global/create';

import { IntersectionDirectiveHandlerCompact } from './directive/extended/intersection';
import { TickDirectiveHandlerCompact } from './directive/extended/tick';

import { FormatMagicHandlerCompact } from './magic/extended/format';

GetOrCreateGlobal();

IntersectionDirectiveHandlerCompact();
TickDirectiveHandlerCompact();

FormatMagicHandlerCompact();
