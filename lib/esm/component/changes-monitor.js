import { JournalTry } from "../journal/try";
import { DeepCopy } from "../utilities/deep-copy";
export class ChangesMonitor {
    constructor() {
        this.listeners_ = new Array();
    }
    AddChangesMonitor(monitor) {
        this.listeners_.push(monitor);
        this.listeners_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.listeners_); },
        })));
    }
    RemoveChangesMonitor(monitor) {
        const len = this.listeners_.length;
        this.listeners_ = this.listeners_.filter(m => (m !== monitor));
        (len != this.listeners_.length) && this.listeners_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.listeners_); },
        })));
    }
    NotifyListeners_(target, object) {
        this.listeners_.forEach(monitor => JournalTry(() => monitor({
            target,
            object: () => DeepCopy(object),
        })));
    }
}
