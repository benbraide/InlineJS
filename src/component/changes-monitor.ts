import { JournalTry } from "../journal/try";
import { ChangesMonitorType } from "../types/element-scope";
import { DeepCopy } from "../utilities/deep-copy";

export class ChangesMonitor{
    private listeners_ = new Array<ChangesMonitorType>();

    public AddChangesMonitor(monitor: ChangesMonitorType){
        this.listeners_.push(monitor);
        this.listeners_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return { ...this.listeners_ } },
        })));
    }

    public RemoveChangesMonitor(monitor: ChangesMonitorType){
        let len = this.listeners_.length;
        this.listeners_ = this.listeners_.filter(m => (m !== monitor));
        (len != this.listeners_.length) && this.listeners_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return { ...this.listeners_ } },
        })));
    }

    protected NotifyListeners_(target: string, object: any){
        this.listeners_.forEach(monitor => JournalTry(() => monitor({
            target,
            object: () => DeepCopy(object),
        })));
    }
}
