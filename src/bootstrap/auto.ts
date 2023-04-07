import { GetOrCreateGlobal } from "../global/create";
import { BootstrapAndAttach } from "./attach";

export function AutoBootstrap(mount?: HTMLElement){
    GetOrCreateGlobal();

    globalThis['InlineJS'] = (globalThis['InlineJS'] || {});
    if (globalThis['InlineJS'].hasOwnProperty('disableAutoBootstrap') && globalThis['InlineJS']['disableAutoBootstrap']){
        return;
    }

    setTimeout(() => {//Bootstrap
        if (document.readyState == "loading"){
            document.addEventListener('DOMContentLoaded', () => {
                BootstrapAndAttach(mount);
            });
        }
        else{//Loaded
            BootstrapAndAttach(mount);
        }
    }, 0);
}
