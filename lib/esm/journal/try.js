import { JournalError } from "./error";
export function JournalTry(callback, context, contextElement) {
    try {
        return callback();
    }
    catch (err) {
        JournalError(err, context, contextElement);
    }
}
