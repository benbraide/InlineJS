"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalWarn = void 0;
function JournalWarn(message, context, contextElement) {
    console.warn({
        message: message,
        context: (context || 'N/A'),
        contextElement: (contextElement || 'N/A'),
    });
}
exports.JournalWarn = JournalWarn;
