import { BootstrapAndAttach } from "../bootstrap/attach";
import { WaitForGlobal } from "../global/get";
import { InitializeGlobalScope } from "../utilities/get-global-scope";
export function InitializeGlobal() {
    InitializeGlobalScope('', {
        waitForGlobal: WaitForGlobal,
        bootstrap: BootstrapAndAttach,
    });
}
