import { GetOrCreateGlobal } from "../global/create";
import { BootstrapAndAttach } from "./attach";

export function AutoBootstrap(mount?: HTMLElement){
    GetOrCreateGlobal();

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
