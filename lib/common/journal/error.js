"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalError = void 0;
function JournalError(message, context, contextElement) {
    console.error({
        message: message,
        context: (context || 'N/A'),
        contextElement: (contextElement || 'N/A'),
    });
}
exports.JournalError = JournalError;
