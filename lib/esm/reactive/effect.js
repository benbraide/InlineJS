import { FindComponentById } from "../component/find";
import { JournalError } from "../journal/error";
import { SubscribeToChanges } from "./subscribe";
export function UseEffect({ componentId, callback, contextElement, options, subscriptionsCallback }) {
    var _a;
    let watch = () => {
        let component = FindComponentById(componentId);
        if (!component) {
            return;
        }
        let { changes } = component.GetBackend(), canceled = false, elScope = (contextElement ? component.FindElementScope(contextElement) : null), cancel = () => {
            canceled = true;
        };
        let element = elScope === null || elScope === void 0 ? void 0 : elScope.GetElement();
        try {
            changes.PushGetAccessStorage(); //Push new storage onto the stack
            callback({
                changes: [],
                cancel: cancel,
            });
        }
        catch (err) {
            JournalError(err, `InlineJS.Component<${componentId}>.UseEffect`, element);
        }
        if (canceled) { //Pop storage
            changes.PopAllGetAccessStorageSnapshots(false); //Remove all outstanding checkpoints
            changes.RestoreOptimizedGetAccessStorage(); //Restore previously swapped optimized storage
            changes.PopGetAccessStorage();
            return;
        }
        SubscribeToChanges({ componentId, changes, callback, subscriptionsCallback, contextElement: element });
    };
    if (options === null || options === void 0 ? void 0 : options.nextTick) {
        (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(watch);
    }
    else { //Immediate watch
        watch();
    }
}
