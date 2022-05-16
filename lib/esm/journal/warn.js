export function JournalWarn(message, context, contextElement) {
    console.warn({
        message: message,
        context: (context || 'N/A'),
        contextElement: (contextElement || 'N/A'),
    });
}
