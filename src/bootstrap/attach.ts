import { ProcessDirectives } from "../directive/process";
import { GetGlobal } from "../global/get";

export function BootstrapAndAttach(mount?: HTMLElement){
    let global = GetGlobal(), config = global.GetConfig();
    [config.GetDirectiveName('data', true), config.GetDirectiveName('data', false)].forEach((name) => {
        (mount || document).querySelectorAll(`[${name}]`).forEach((element) => {
            if (!element.hasAttribute(name) || !document.contains(element)){//Probably contained inside another region
                return;
            }

            let component = global.CreateComponent(<HTMLElement>element);
            ProcessDirectives({
                component: component,
                element: <HTMLElement>element,
                options: {
                    checkTemplate: true,
                    checkDocument: false,
                    ignoreChildren: false,
                },
            });
        });
    });
}
