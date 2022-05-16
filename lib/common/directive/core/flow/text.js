"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextDirectiveHandlerCompact = exports.TextDirectiveHandler = void 0;
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const stream_data_1 = require("../../../evaluator/stream-data");
const to_string_1 = require("../../../utilities/to-string");
const lazy_1 = require("../../lazy");
exports.TextDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('text', (_a) => {
    var { contextElement } = _a, rest = __rest(_a, ["contextElement"]);
    let checkpoint = 0;
    (0, lazy_1.LazyCheck)(Object.assign(Object.assign({ contextElement }, rest), { callback: (value) => {
            let myCheckpoint = ++checkpoint;
            (0, stream_data_1.StreamData)(value, (value) => {
                if (myCheckpoint == checkpoint) {
                    contextElement.textContent = (0, to_string_1.ToString)(value);
                }
            });
        } }));
});
function TextDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.TextDirectiveHandler);
}
exports.TextDirectiveHandlerCompact = TextDirectiveHandlerCompact;
