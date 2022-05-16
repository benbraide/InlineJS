import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { ToString } from "../../../utilities/to-string";
import { ResolveKeyValue } from "../../key-value";
import { ToCamelCase } from "../../../utilities/camel-case";
export const StyleDirectiveHandler = CreateDirectiveHandlerCallback('style', ({ componentId, contextElement, expression, argKey }) => {
    ResolveKeyValue({ componentId, contextElement, expression,
        key: argKey.trim(),
        callback: ([key, value]) => {
            key = ToCamelCase(key, false, '.');
            if (key in contextElement.style) {
                contextElement.style[key] = ToString(value);
            }
        },
    });
});
export function StyleDirectiveHandlerCompact() {
    AddDirectiveHandler(StyleDirectiveHandler);
}
