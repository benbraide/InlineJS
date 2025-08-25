import { IBubbledChange, IChange } from "../types/change";
import { IProxyAccessStorage } from "../types/storage";
export interface ISubscribeDetails {
    changes: Array<IChange | IBubbledChange>;
    cancel: () => void;
}
export type SubscriptionsCallbackType = (list: Record<string, Array<string>>) => void;
export type SubscribeCallbackType = (details?: ISubscribeDetails) => void | boolean;
export interface ISubscribeToChangesParams {
    componentId: string;
    proxyAccessStorage: IProxyAccessStorage;
    callback: SubscribeCallbackType;
    subscriptionsCallback?: SubscriptionsCallbackType;
    contextElement?: HTMLElement;
}
export declare function SubscribeToChanges({ componentId, proxyAccessStorage, callback, subscriptionsCallback, contextElement }: ISubscribeToChangesParams): (() => void) | null;
