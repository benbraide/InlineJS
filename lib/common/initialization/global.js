"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeGlobal = void 0;
const attach_1 = require("../bootstrap/attach");
const process_1 = require("../directive/process");
const create_1 = require("../global/create");
const get_1 = require("../global/get");
const interpolator_1 = require("../global/interpolator");
const get_global_scope_1 = require("../utilities/get-global-scope");
function InitializeGlobal() {
    (0, get_global_scope_1.InitializeGlobalScope)('global', {
        bootstrap: attach_1.BootstrapAndAttach,
        waitForGlobal: get_1.WaitForGlobal,
        get: get_1.GetGlobal,
        create: create_1.CreateGlobal,
        replaceText: interpolator_1.ReplaceText,
        interpolateText: interpolator_1.InterpolateText,
        interpolate: interpolator_1.Interpolate,
        processDirectives: process_1.ProcessDirectives,
    });
}
exports.InitializeGlobal = InitializeGlobal;
