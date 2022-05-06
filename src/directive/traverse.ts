import { JournalError } from "../journal/error";
import { IDirective } from "../types/directive";
import { CreateDirective } from "./create";

export interface ITraverseDirectivesParams{
    element: Element;
    callback: (directive: IDirective) => void;
    attributeCallback?: (name: string, value: string) => void;
}

export function TraverseDirectives({ element, callback, attributeCallback }: ITraverseDirectivesParams){
    Array.from(element.attributes || []).forEach((attr) => {
        try{
            if (attributeCallback){
                attributeCallback(attr.name, (attr.value || ''));
            }
            
            let directive = CreateDirective(attr.name, (attr.value || ''));
            if (directive){
                callback(directive);
            }
        }
        catch (err){
            JournalError(err, 'InlineJS.TraverseDirectives', element);
        }
    });
}
