export declare class NextTick {
    private componentId_;
    private callback_?;
    private initialized_;
    private queued_;
    private setCallback_;
    constructor(componentId_: string, callback_?: (() => void) | undefined, initialized_?: boolean);
    Queue(callback?: () => void): void;
}
