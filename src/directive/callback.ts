import { DirectiveHandlerCallbackType, IDirectiveHandlerCallbackDetails } from "../types/directive";

export function CreateDirectiveHandlerCallback(name: string, callback: DirectiveHandlerCallbackType): IDirectiveHandlerCallbackDetails{
    return { name, callback };
}
