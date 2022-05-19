import { IMagicHandlerCallbackDetails, MagicHandlerCallbackType } from "../types/magic";

export function CreateMagicHandlerCallback(name: string, callback: MagicHandlerCallbackType, onAccess?: MagicHandlerCallbackType): IMagicHandlerCallbackDetails{
    return { name, callback, onAccess };
}
