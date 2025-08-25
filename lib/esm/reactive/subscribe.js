import { FindComponentById } from "../component/find";
import { JournalError } from "../journal/error";
export function SubscribeToChanges({ componentId, proxyAccessStorage, callback, subscriptionsCallback, contextElement }) {
    var _a, _b;
    if (proxyAccessStorage.IsEmpty()) { // No reactive access
        subscriptionsCallback === null || subscriptionsCallback === void 0 ? void 0 : subscriptionsCallback({});
        return null;
    }
    let subscriptionIds = {}, unsubscribeAll = () => {
        for (const cId in subscriptionIds) {
            const component = FindComponentById(cId);
            if (!component) {
                continue;
            }
            const { changes } = component.GetBackend();
            subscriptionIds[cId].forEach(id => changes.Unsubscribe(id));
        }
        subscriptionIds = {};
    };
    let canceled = false, cancel = () => {
        canceled = true;
    };
    const onChange = (list) => {
        const component = FindComponentById(componentId);
        if (!component || canceled) {
            unsubscribeAll();
            return;
        }
        const { changes } = component.GetBackend();
        changes.PushOrigin(onChange);
        try {
            callback({
                changes: list,
                cancel: cancel,
            });
        }
        catch (err) {
            JournalError(err, `InlineJS.Component<${componentId}>.SubscribeToChanges.OnChange`);
        }
        changes.PopOrigin();
        if (canceled) {
            unsubscribeAll();
        }
    };
    const groupedEntries = proxyAccessStorage.GetGroupedEntries();
    for (const cId in groupedEntries) {
        const component = FindComponentById(cId);
        if (!component) {
            continue;
        }
        const newSubscriptionIds = new Array(), { changes } = component.GetBackend();
        groupedEntries[cId].forEach(details => newSubscriptionIds.push(changes.Subscribe(details.path, onChange)));
        subscriptionIds[cId] = newSubscriptionIds;
    }
    if (contextElement) { // Unsubscribe all when element is destroyed
        (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => {
            cancel();
            unsubscribeAll();
        });
    }
    subscriptionsCallback === null || subscriptionsCallback === void 0 ? void 0 : subscriptionsCallback(subscriptionIds);
    return unsubscribeAll;
}
