import { JournalError } from "../journal/error";
import { IDirective } from "../types/directive";
import { CreateDirective } from "./create";

export function TraverseDirectives(element: Element, callback: (directive: IDirective) => void){
    Array.from(element.attributes || []).forEach((attr) => {
        try{
            let directive = CreateDirective(attr.name, attr.value);
            if (directive){
                callback(directive);
            }
        }
        catch (err){
            JournalError(err, 'InlineJS.TraverseDirectives', element);
        }
    });
}
