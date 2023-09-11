"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJS = void 0;
const dev_1 = require("./initialization/dev");
const global_1 = require("./initialization/global");
const utilities_1 = require("./initialization/utilities");
const values_1 = require("./initialization/values");
const version_1 = require("./initialization/version");
function InlineJS() {
    (0, dev_1.InitializeDev)();
    (0, global_1.InitializeGlobal)();
    (0, utilities_1.InitializeUtilities)();
    (0, values_1.InitializeValues)();
    (0, version_1.InitializeVersion)();
}
exports.InlineJS = InlineJS;
