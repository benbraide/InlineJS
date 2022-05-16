import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { GetGlobal } from "../../global/get";
import { AddChanges } from "../../proxy/add-changes";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
const StateDirectiveName = 'state';
function BindState(componentId, component, contextElement) {
    let elementScope = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement), localKey = `\$${StateDirectiveName}`, parentKey = `#${StateDirectiveName}`;
    if (elementScope === null || elementScope === void 0 ? void 0 : elementScope.HasLocal(localKey)) {
        return;
    }
    let resetCallbacks = new Array();
    let id = ((component === null || component === void 0 ? void 0 : component.GenerateUniqueId('state_proxy_')) || ''), errorCallbacks = new Array(), state = {
        invalid: 0,
        dirty: 0,
        changed: 0,
    };
    let message = null, parent = component === null || component === void 0 ? void 0 : component.FindElementLocalValue(contextElement, parentKey, true), alertUpdate = (key, trend) => {
        var _a;
        if ((trend == -1 && state[key] == 0) || (trend == 1 && state[key] == 1)) {
            AddChanges('set', `${id}.${key}`, key, (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
            if (parent) { //Update parent
                parent.offsetState(key, ((state[key] == 0) ? -1 : 1));
            }
        }
    };
    if (GetGlobal().IsNothing(parent)) {
        parent = null;
    }
    let offsetState = (key, offset, max = 0) => {
        let previousValue = state[key];
        state[key] += offset;
        state[key] = ((state[key] < 0) ? 0 : ((max <= 0 || state[key] < max) ? state[key] : max));
        if (previousValue != state[key]) {
            alertUpdate(key, offset);
        }
    };
    let updateMessage = (value) => {
        var _a;
        if (value !== message) {
            message = value;
            AddChanges('set', `${id}.message`, 'message', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
        }
    };
    let getLocal = (target) => {
        var _a, _b;
        let local = (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(target)) === null || _b === void 0 ? void 0 : _b.GetLocal(localKey);
        return (GetGlobal().IsNothing(local) ? null : local);
    };
    let getArray = (value) => ((typeof value === 'string') ? [value] : value), getRoot = () => {
        return (parent ? parent.getRoot() : getLocal(contextElement));
    };
    let getMessage = () => {
        var _a;
        if (message !== null) {
            (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.message`);
            return message;
        }
        return errorCallbacks.reduce((prev, callback) => [...prev, ...getArray(callback())], new Array()).filter(msg => !!msg);
    };
    let isInput = (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement), local = CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            var _a;
            if (prop && state.hasOwnProperty(prop)) {
                (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return (state[prop] > 0);
            }
            if (prop === 'message') {
                return getMessage();
            }
            if (prop === 'parent') {
                return (parent ? getLocal(contextElement.parentElement) : null);
            }
            if (prop === 'root') {
                return getRoot();
            }
            if (prop === 'reset') {
                return reset;
            }
        },
        lookup: [...Object.keys(state), 'message', 'parent', 'root', 'reset'],
    }));
    if (isInput || contextElement instanceof HTMLSelectElement) {
        let initialValue = contextElement.value, onEvent = () => {
            offsetState('dirty', 1, 1);
            offsetState('changed', (contextElement.value === initialValue) ? -1 : 1, 1);
            offsetState('invalid', (contextElement.validity.valid ? -1 : 1), 1);
            updateMessage(contextElement.validationMessage);
        };
        contextElement.addEventListener('change', onEvent);
        if (isInput) {
            contextElement.addEventListener('input', onEvent);
        }
        message = contextElement.validationMessage;
        if (!contextElement.validity.valid) {
            offsetState('invalid', 1, 1);
        }
    }
    else if (contextElement.firstElementChild) {
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(parentKey, { getRoot, offsetState,
            addErrorCallback: (callback) => errorCallbacks.push(callback),
            removeErrorCallback: (callback) => (errorCallbacks = errorCallbacks.filter(c => (c !== callback))),
            addResetCallback: (callback) => resetCallbacks.push(callback),
            removeResetCallback: (callback) => (resetCallbacks = resetCallbacks.filter(c => (c !== callback))),
        });
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddTreeChangeCallback(({ added }) => added.forEach(child => BindState(componentId, null, child)));
        [...contextElement.children].forEach((child) => {
            component === null || component === void 0 ? void 0 : component.CreateElementScope(child);
            BindState(componentId, component, child);
        });
    }
    let reset = () => {
        Object.keys(state).filter(key => (state[key] != 0)).forEach((key) => {
            state[key] = 0;
            alertUpdate(key, -1);
        });
        resetCallbacks.forEach(callback => callback());
    };
    if (!isInput && !(contextElement instanceof HTMLSelectElement) && errorCallbacks.length == 0) {
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.DeleteLocal(parentKey);
        return; //No bindings
    }
    if (parent) {
        parent.addErrorCallback(getMessage);
        parent.addResetCallback(reset);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => {
            parent.removeResetCallback(reset);
            parent.removeErrorCallback(getMessage);
        });
    }
    else { //Listen for form reset, if possible
        let form = component === null || component === void 0 ? void 0 : component.FindElement(contextElement, el => (el instanceof HTMLFormElement));
        if (form) {
            form.addEventListener('reset', reset);
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => form.removeEventListener('reset', reset));
        }
    }
    elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(localKey, local);
}
export const StateDirectiveHandler = CreateDirectiveHandlerCallback(StateDirectiveName, ({ componentId, component, contextElement }) => {
    BindState(componentId, (component || FindComponentById(componentId)), contextElement);
});
export function StateDirectiveHandlerCompact() {
    AddDirectiveHandler(StateDirectiveHandler);
}
