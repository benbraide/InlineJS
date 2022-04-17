import { JournalError } from "./error";

export function JournalTry(callback: () => any, context?: string, contextElement?: Element){
    try{
        return callback();
    }
    catch (err){
        JournalError(err, context, contextElement);
    }
}
