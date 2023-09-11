import { InferComponent } from "../component/infer";
import { ProcessDirectives } from "../directive/process";
import { GetGlobal } from "../global/get";
export function BootstrapAndAttach(mount) {
    const component = (mount && InferComponent(mount));
    if (component) { //Component already created
        ProcessDirectives({
            component,
            element: mount,
        });
        return;
    }
    const global = GetGlobal(), config = global.GetConfig();
    [config.GetDirectiveName('data', true), config.GetDirectiveName('data', false)].forEach((name) => {
        (mount || document).querySelectorAll(`[${name}]`).forEach((element) => {
            if (!element.hasAttribute(name) || !document.contains(element)) { //Probably contained inside another region
                return;
            }
            let component = global.CreateComponent(element);
            ProcessDirectives({
                component: component,
                element: element,
                options: {
                    checkTemplate: true,
                    checkDocument: false,
                    ignoreChildren: false,
                },
            });
        });
    });
}
