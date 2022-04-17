import { SubscribeCallbackType, SubscriptionsCallbackType } from "./subscribe";
export interface IUseEffectOptions {
    nextTick?: boolean;
}
export interface IUseEffectInfo {
    componentId: string;
    callback: SubscribeCallbackType;
    contextElement: HTMLElement | string | null;
    options?: IUseEffectOptions;
    subscriptionsCallback?: SubscriptionsCallbackType;
}
export declare function UseEffect({ componentId, callback, contextElement, options, subscriptionsCallback }: IUseEffectInfo): void;
