import { GetGlobal, WaitForGlobal } from './global/get';

import { TimeDifferenceConcept } from './concepts/time-diff';

import { TimeDifferenceDirectiveHandlerCompact } from './directive/plugin/time-diff';

import { TimeDifferenceMagicHandlerCompact } from './magic/plugin/time-diff';

WaitForGlobal().then(() => {
    GetGlobal().SetTimeDifferenceConcept(new TimeDifferenceConcept());
    TimeDifferenceDirectiveHandlerCompact();
    TimeDifferenceMagicHandlerCompact();
});
