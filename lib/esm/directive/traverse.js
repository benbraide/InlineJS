import { JournalError } from "../journal/error";
import { CreateDirective } from "./create";
export function TraverseDirectives({ element, callback, attributeCallback, proxyAccessHandler }) {
    Array.from(element.attributes).forEach((attr) => {
        try {
            attributeCallback && attributeCallback(attr.name, (attr.value || ''));
            const directive = CreateDirective(attr.name, (attr.value || ''), proxyAccessHandler);
            directive && callback(directive);
        }
        catch (err) {
            JournalError(err, 'InlineJS.TraverseDirectives', element);
        }
    });
}
