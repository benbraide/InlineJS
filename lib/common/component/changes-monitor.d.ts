import { ChangesMonitorType } from "../types/element-scope";
export declare class ChangesMonitor {
    private listeners_;
    AddChangesMonitor(monitor: ChangesMonitorType): void;
    RemoveChangesMonitor(monitor: ChangesMonitorType): void;
    protected NotifyListeners_(target: string, object: any): void;
}
