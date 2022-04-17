import { DirectiveHandlerCallbackType, IDirectiveHandlerCallbackDetails } from "../types/directives";

export function CreateDirectiveHandlerCallback(name: string, callback: DirectiveHandlerCallbackType): IDirectiveHandlerCallbackDetails{
    return { name, callback };
}
