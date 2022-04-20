import { JournalTry } from "../journal/try";

export class Loop<T = any>{
    private whileCallbacks_ = new Array<(value: T) => void>();
    private finalCallbacks_ = new Array<(value: T) => void>();
    
    public constructor(callback: (doWhile: (value: T) => void, doFinal: (value: T) => void) => void){
        callback((value) => {
            this.whileCallbacks_.slice(0).forEach(callback => JournalTry(() => callback(value), 'InlineJS.Loop.While'));
        }, (value) => {
            this.finalCallbacks_.slice(0).forEach(callback => JournalTry(() => callback(value), 'InlineJS.Loop.Final'));
        });
    }

    public While(callback: (value: T) => void){
        this.whileCallbacks_.push(callback);
        return this;
    }

    public Final(callback: (value: T) => void){
        this.finalCallbacks_.push(callback);
        return this;
    }
}
