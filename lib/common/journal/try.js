"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalTry = void 0;
const error_1 = require("./error");
function JournalTry(callback, context, contextElement) {
    try {
        return callback();
    }
    catch (err) {
        (0, error_1.JournalError)(err, context, contextElement);
    }
}
exports.JournalTry = JournalTry;
