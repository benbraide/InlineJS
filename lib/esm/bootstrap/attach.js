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
    const dataNames = [config.GetDirectiveName('data', true), config.GetDirectiveName('data', false)];
    const selector = dataNames.map(name => `[${name}]`).join(', ');
    const potentialRoots = new Set();
    if (mount) {
        if (dataNames.some(name => mount.hasAttribute(name))) {
            potentialRoots.add(mount);
        }
        mount.querySelectorAll(selector).forEach(el => potentialRoots.add(el));
    }
    else {
        document.querySelectorAll(selector).forEach(el => potentialRoots.add(el));
    }
    potentialRoots.forEach((element) => {
        if (!dataNames.some(name => element.hasAttribute(name)) || !document.contains(element)) { //Already processed
            return;
        }
        ProcessDirectives({
            component: global.CreateComponent(element),
            element: element,
            options: { checkTemplate: true, checkDocument: false, ignoreChildren: false },
        });
    });
}
