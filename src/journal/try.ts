import { JournalError } from "./error";

export function JournalTry<T = any>(callback: () => T, context?: string, contextElement?: Element){
    try{
        return callback();
    }
    catch (err){
        JournalError(err, context, contextElement);
    }
}
