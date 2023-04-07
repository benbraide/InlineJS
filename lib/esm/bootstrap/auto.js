import { GetOrCreateGlobal } from "../global/create";
import { BootstrapAndAttach } from "./attach";
export function AutoBootstrap(mount) {
    GetOrCreateGlobal();
    globalThis['InlineJS'] = (globalThis['InlineJS'] || {});
    if (globalThis['InlineJS'].hasOwnProperty('disableAutoBootstrap') && globalThis['InlineJS']['disableAutoBootstrap']) {
        return;
    }
    setTimeout(() => {
        if (document.readyState == "loading") {
            document.addEventListener('DOMContentLoaded', () => {
                BootstrapAndAttach(mount);
            });
        }
        else { //Loaded
            BootstrapAndAttach(mount);
        }
    }, 0);
}
