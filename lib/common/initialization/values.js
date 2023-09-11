"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeValues = void 0;
const future_1 = require("../values/future");
const loop_1 = require("../values/loop");
const nothing_1 = require("../values/nothing");
const stack_1 = require("../stack");
const get_global_scope_1 = require("../utilities/get-global-scope");
function InitializeValues() {
    (0, get_global_scope_1.InitializeGlobalScope)('values', {
        future: future_1.Future,
        loop: loop_1.Loop,
        nothing: nothing_1.Nothing,
        stack: stack_1.Stack,
    });
}
exports.InitializeValues = InitializeValues;
