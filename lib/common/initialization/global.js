"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeGlobal = void 0;
const attach_1 = require("../bootstrap/attach");
const get_1 = require("../global/get");
const get_global_scope_1 = require("../utilities/get-global-scope");
function InitializeGlobal() {
    (0, get_global_scope_1.InitializeGlobalScope)('', {
        waitForGlobal: get_1.WaitForGlobal,
        bootstrap: attach_1.BootstrapAndAttach,
    });
}
exports.InitializeGlobal = InitializeGlobal;
