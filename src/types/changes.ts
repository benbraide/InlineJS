import { ChangeCallbackType, IBubbledChange, IChange } from "./change";

export interface ISubscriberInfo{
    path: string;
    callback: ChangeCallbackType;
}

export interface IChanges{
    GetComponentId(): string;
    
    AddNextTickHandler(handler: () => void): void;
    AddNextIdleHandler(handler: () => void): void;
    AddNextNonIdleHandler(handler: () => void): void;
    Schedule(): void;
    
    Add(change: IChange | IBubbledChange): void;
    AddComposed(prop: string, prefix?: string, targetPath?: string): void;
    GetLastChange(index?: number): IChange | IBubbledChange | null;
    
    PushOrigin(origin: ChangeCallbackType): void;
    PeekOrigin(): ChangeCallbackType | null;
    PopOrigin(): ChangeCallbackType | null;

    Subscribe(path: string, handler: ChangeCallbackType): string;
    Unsubscribe(subscribed: ChangeCallbackType | string, path?: string): void;

    Destroy(): void;
}
