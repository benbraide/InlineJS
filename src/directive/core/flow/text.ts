import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { ToString } from "../../../utilities/to-string";
import { LazyCheck } from "../../lazy";

export const TextDirectiveHandler = CreateDirectiveHandlerCallback('text', ({ contextElement, ...rest }) => {
    LazyCheck({ contextElement, ...rest,
        callback: value => (contextElement.textContent = ToString(value)),
    });
});

export function TextDirectiveHandlerCompact(){
    AddDirectiveHandler(TextDirectiveHandler);
}
