import { MagicHandlerCallbackType, IMagicHandler, IMagicManager, IMagicHandlerParams } from "../types/magic";
export declare class MagicManager implements IMagicManager {
    private handlers_;
    AddHandler(handler: IMagicHandler | MagicHandlerCallbackType, name?: string, onAccess?: MagicHandlerCallbackType): void;
    RemoveHandler(name: string): void;
    FindHandler(name: string, accessParams?: IMagicHandlerParams): MagicHandlerCallbackType | null;
}
