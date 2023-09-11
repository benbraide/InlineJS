"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootstrapAndAttach = void 0;
const infer_1 = require("../component/infer");
const process_1 = require("../directive/process");
const get_1 = require("../global/get");
function BootstrapAndAttach(mount) {
    const component = (mount && (0, infer_1.InferComponent)(mount));
    if (component) { //Component already created
        (0, process_1.ProcessDirectives)({
            component,
            element: mount,
        });
        return;
    }
    const global = (0, get_1.GetGlobal)(), config = global.GetConfig();
    [config.GetDirectiveName('data', true), config.GetDirectiveName('data', false)].forEach((name) => {
        (mount || document).querySelectorAll(`[${name}]`).forEach((element) => {
            if (!element.hasAttribute(name) || !document.contains(element)) { //Probably contained inside another region
                return;
            }
            let component = global.CreateComponent(element);
            (0, process_1.ProcessDirectives)({
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
exports.BootstrapAndAttach = BootstrapAndAttach;
