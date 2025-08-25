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
        (0, process_1.ProcessDirectives)({
            component: global.CreateComponent(element),
            element: element,
            options: { checkTemplate: true, checkDocument: false, ignoreChildren: false },
        });
    });
}
exports.BootstrapAndAttach = BootstrapAndAttach;
