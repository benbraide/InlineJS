"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoBootstrap = void 0;
const create_1 = require("../global/create");
const get_global_scope_1 = require("../utilities/get-global-scope");
const attach_1 = require("./attach");
function AutoBootstrap(mount) {
    (0, create_1.GetOrCreateGlobal)();
    const globalScope = (0, get_global_scope_1.GetGlobalScope)();
    if (globalScope.hasOwnProperty('disableAutoBootstrap') && globalScope['disableAutoBootstrap']) {
        return;
    }
    setTimeout(() => {
        if (document.readyState == "loading") {
            document.addEventListener('DOMContentLoaded', () => {
                (0, attach_1.BootstrapAndAttach)(mount);
            });
        }
        else { //Loaded
            (0, attach_1.BootstrapAndAttach)(mount);
        }
    }, 0);
}
exports.AutoBootstrap = AutoBootstrap;
