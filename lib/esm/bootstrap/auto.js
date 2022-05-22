import { GetOrCreateGlobal } from "../global/create";
import { BootstrapAndAttach } from "./attach";
export function AutoBootstrap(mount) {
    GetOrCreateGlobal();
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
