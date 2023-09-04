"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangesMonitor = void 0;
const try_1 = require("../journal/try");
const deep_copy_1 = require("../utilities/deep-copy");
class ChangesMonitor {
    constructor() {
        this.listeners_ = new Array();
    }
    AddChangesMonitor(monitor) {
        this.listeners_.push(monitor);
        this.listeners_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.listeners_); },
        })));
    }
    RemoveChangesMonitor(monitor) {
        let len = this.listeners_.length;
        this.listeners_ = this.listeners_.filter(m => (m !== monitor));
        (len != this.listeners_.length) && this.listeners_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.listeners_); },
        })));
    }
    NotifyListeners_(target, object) {
        this.listeners_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target,
            object: () => (0, deep_copy_1.DeepCopy)(object),
        })));
    }
}
exports.ChangesMonitor = ChangesMonitor;
