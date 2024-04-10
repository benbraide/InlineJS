import { GetOrCreateGlobal } from "../global/create";
import { GetGlobalScope } from "../utilities/get-global-scope";
import { BootstrapAndAttach } from "./attach";

export function AutoBootstrap(mount?: HTMLElement){
    GetOrCreateGlobal();

    const globalScope = GetGlobalScope();
    if (globalScope.hasOwnProperty('disableAutoBootstrap') && globalScope['disableAutoBootstrap']){
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
