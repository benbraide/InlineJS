import { InitializeDev } from './initialization/dev';
import { InitializeGlobal } from './initialization/global';
import { InitializeUtilities } from './initialization/utilities';
import { InitializeValues } from './initialization/values';
import { InitializeVersion } from './initialization/version';
export function InlineJS() {
    InitializeDev();
    InitializeGlobal();
    InitializeUtilities();
    InitializeValues();
    InitializeVersion();
}
