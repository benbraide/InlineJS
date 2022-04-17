import { IBubbledChange, IChange } from "../types/change";
import { IChanges } from "../types/changes";
export interface ISubscribeDetails {
    changes: Array<IChange | IBubbledChange>;
    cancel: () => void;
}
export declare type SubscriptionsCallbackType = (list: Record<string, Array<string>>) => void;
export declare type SubscribeCallbackType = (details?: ISubscribeDetails) => void | boolean;
export declare function SubscribeToChanges(componentId: string, changes: IChanges, callback: SubscribeCallbackType, subscriptionsCallback?: SubscriptionsCallbackType): (() => void) | null;
