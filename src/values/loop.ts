import { JournalTry } from "../journal/try";

export class Loop{
    private whileCallbacks_ = new Array<(value: any) => void>();
    private finalCallbacks_ = new Array<(value: any) => void>();
    
    public constructor(callback: (doWhile: (value: any) => void, doFinal: (value: any) => void) => void){
        callback((value) => {
            this.whileCallbacks_.slice(0).forEach(callback => JournalTry(() => callback(value), 'InlineJS.Loop.While'));
        }, (value) => {
            this.finalCallbacks_.slice(0).forEach(callback => JournalTry(() => callback(value), 'InlineJS.Loop.Final'));
        });
    }

    public While(callback: (value: any) => void){
        this.whileCallbacks_.push(callback);
        return this;
    }

    public Final(callback: (value: any) => void){
        this.finalCallbacks_.push(callback);
        return this;
    }
}
