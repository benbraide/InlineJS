import { JournalTry } from "../journal/try";
export class Loop {
    constructor(callback) {
        this.whileCallbacks_ = new Array();
        this.finalCallbacks_ = new Array();
        callback((value) => {
            this.whileCallbacks_.slice(0).forEach((callback, index) => {
                if (JournalTry(() => callback(value), 'InlineJS.Loop.While') === false) {
                    this.whileCallbacks_.splice(index, 1);
                }
            });
        }, (value) => {
            this.whileCallbacks_.splice(0);
            this.finalCallbacks_.splice(0).forEach(callback => JournalTry(() => callback(value), 'InlineJS.Loop.Final'));
        }, () => {
            this.whileCallbacks_.splice(0);
            this.finalCallbacks_.splice(0);
        });
    }
    While(callback) {
        this.whileCallbacks_.push(callback);
        return this;
    }
    Final(callback) {
        this.finalCallbacks_.push(callback);
        return this;
    }
}
