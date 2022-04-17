export function JournalError(message: any, context?: string, contextElement?: Element){
    console.error({
        message: message,
        context: (context || 'N/A'),
        contextElement: (contextElement || 'N/A'),
    });
}
