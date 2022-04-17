import { IMagicHandlerCallbackDetails, MagicHandlerCallbackType } from "../types/magics";

export function CreateMagicHandlerCallback(name: string, callback: MagicHandlerCallbackType, onAccess?: MagicHandlerCallbackType): IMagicHandlerCallbackDetails{
    return { name, callback, onAccess };
}
