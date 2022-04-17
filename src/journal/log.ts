export function JournalLog(message: any, context?: string, contextElement?: Element){
    console.log({
        message: message,
        context: (context || 'N/A'),
        contextElement: (contextElement || 'N/A'),
    });
}
