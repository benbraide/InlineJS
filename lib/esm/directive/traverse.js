import { JournalError } from "../journal/error";
import { CreateDirective } from "./create";
export function TraverseDirectives({ element, callback, attributeCallback }) {
    Array.from(element.attributes || []).forEach((attr) => {
        try {
            if (attributeCallback) {
                attributeCallback(attr.name, (attr.value || ''));
            }
            let directive = CreateDirective(attr.name, (attr.value || ''));
            if (directive) {
                callback(directive);
            }
        }
        catch (err) {
            JournalError(err, 'InlineJS.TraverseDirectives', element);
        }
    });
}
