"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalLog = void 0;
function JournalLog(message, context, contextElement) {
    console.log({
        message: message,
        context: (context || 'N/A'),
        contextElement: (contextElement || 'N/A'),
    });
}
exports.JournalLog = JournalLog;
