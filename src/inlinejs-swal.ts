import { GetGlobal, WaitForGlobal } from './global/get';

import { SwalAlert } from './concepts/swal';

import { AlertMagicHandlerCompact } from './magic/plugin/alert';

WaitForGlobal().then(() => {
    GetGlobal().SetAlertConcept(new SwalAlert());
    AlertMagicHandlerCompact();
});
