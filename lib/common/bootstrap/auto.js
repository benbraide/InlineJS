"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoBootstrap = void 0;
const create_1 = require("../global/create");
const attach_1 = require("./attach");
function AutoBootstrap(mount) {
    (0, create_1.GetOrCreateGlobal)();
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
