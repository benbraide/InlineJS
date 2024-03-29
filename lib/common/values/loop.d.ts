export declare class Loop<T = any> {
    private whileCallbacks_;
    private finalCallbacks_;
    constructor(callback: (doWhile: (value: T) => void, doFinal: (value: T) => void, doAbort: () => void) => void);
    While(callback: (value: T) => void | boolean): this;
    Final(callback: (value: T) => void): this;
}
