/**
 *
 * @param type The type of change ('set' | 'delete')
 * @param path The full path to the property that changed (e.g. 'myProxy.data.name')
 * @param prop The name of the property that changed (e.g. 'name')
 * @param changes The changes instance to add the change to
 * @param shouldBubble Whether to bubble the change up to parent paths
 */
export function AddChanges(type, path, prop, changes, shouldBubble = true) {
    if (!changes) {
        return;
    }
    const change = {
        componentId: changes.GetComponentId(),
        type: type,
        path: path,
        prop: prop,
        origin: changes.PeekOrigin(),
    };
    changes.Add(change);
    if (!shouldBubble) {
        return;
    }
    const parts = path.split('.');
    while (parts.length > 2) { //Bubble up while skipping root
        parts.pop();
        changes.Add({
            original: change,
            path: parts.join('.'),
        });
    }
}
