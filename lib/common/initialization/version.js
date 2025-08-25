"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeVersion = void 0;
const get_global_scope_1 = require("../utilities/get-global-scope");
function InitializeVersion() {
    (0, get_global_scope_1.InitializeGlobalScope)('version', {
        major: 1,
        minor: 4,
        patch: 1,
        get value() {
            return `${this.major}.${this.minor}.${this.patch}`;
        },
        toString() {
            return this.value;
        },
    });
}
exports.InitializeVersion = InitializeVersion;
