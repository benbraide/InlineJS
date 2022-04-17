export function JournalWarn(message: any, context?: string, contextElement?: Element){
    console.warn({
        message: message,
        context: (context || 'N/A'),
        contextElement: (contextElement || 'N/A'),
    });
}
