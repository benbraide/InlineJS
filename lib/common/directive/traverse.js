"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraverseDirectives = void 0;
const error_1 = require("../journal/error");
const create_1 = require("./create");
function TraverseDirectives({ element, callback, attributeCallback, proxyAccessHandler }) {
    Array.from(element.attributes).forEach((attr) => {
        try {
            attributeCallback && attributeCallback(attr.name, (attr.value || ''));
            const directive = (0, create_1.CreateDirective)(attr.name, (attr.value || ''), proxyAccessHandler);
            directive && callback(directive);
        }
        catch (err) {
            (0, error_1.JournalError)(err, 'InlineJS.TraverseDirectives', element);
        }
    });
}
exports.TraverseDirectives = TraverseDirectives;
