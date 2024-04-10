import { IBubbledChange, IChange } from "../types/change";
import { IChanges } from "../types/changes";
export interface ISubscribeDetails {
    changes: Array<IChange | IBubbledChange>;
    cancel: () => void;
}
export type SubscriptionsCallbackType = (list: Record<string, Array<string>>) => void;
export type SubscribeCallbackType = (details?: ISubscribeDetails) => void | boolean;
export interface ISubscribeToChangesParams {
    componentId: string;
    changes: IChanges;
    callback: SubscribeCallbackType;
    subscriptionsCallback?: SubscriptionsCallbackType;
    contextElement?: HTMLElement;
}
export declare function SubscribeToChanges({ componentId, changes, callback, subscriptionsCallback, contextElement }: ISubscribeToChangesParams): (() => void) | null;
