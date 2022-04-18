export declare class Loop {
    private whileCallbacks_;
    private finalCallbacks_;
    constructor(callback: (doWhile: (value: any) => void, doFinal: (value: any) => void) => void);
    While(callback: (value: any) => void): this;
    Final(callback: (value: any) => void): this;
}
