import { PopCurrentComponent, PushCurrentComponent } from "../component/current";
import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { ContextKeys } from "../utilities/context-keys";
import { WaitPromise } from "./wait-promise";
const InlineJSContextKey = '__InlineJS_Context__';
let InlineJSValueFunctions = {};
let InlineJSVoidFunctions = {};
export function GenerateValueReturningFunction(expression, componentId) {
    if (InlineJSValueFunctions.hasOwnProperty(expression)) {
        return InlineJSValueFunctions[expression];
    }
    if (InlineJSVoidFunctions.hasOwnProperty(expression)) {
        return null; //Prevent retries when a void version exists
    }
    try {
        let newFunction = (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                return (${expression});
            };
        `));
        return (InlineJSValueFunctions[expression] = newFunction);
    }
    catch (err) {
        if (!(err instanceof SyntaxError)) {
            JournalError(err, `InlineJs.Region<${componentId || 'NIL'}>.GenerateValueReturningFunction`);
        }
    }
    return null;
}
export function GenerateVoidFunction(expression, componentId) {
    if (InlineJSVoidFunctions.hasOwnProperty(expression)) {
        return InlineJSVoidFunctions[expression];
    }
    try {
        let newFunction = (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                ${expression};
            };
        `));
        return (InlineJSVoidFunctions[expression] = newFunction);
    }
    catch (err) {
        JournalError(err, `InlineJs.Region<${componentId || 'NIL'}>.GenerateVoidFunction`);
    }
    return null;
}
export function CallIfFunction(value, handler, componentId, params = []) {
    var _a;
    if (typeof value === 'function') { //Call function
        let component = FindComponentById(componentId || ''), lastContext = component === null || component === void 0 ? void 0 : component.FindProxy(component === null || component === void 0 ? void 0 : component.GetBackend().changes.GetLastAccessContext());
        let result = value.apply((((_a = (lastContext || (component === null || component === void 0 ? void 0 : component.GetRootProxy()))) === null || _a === void 0 ? void 0 : _a.GetNative()) || null), (params || []));
        return (handler ? handler(result) : result);
    }
    return (handler ? handler(value) : value);
}
export function GenerateFunctionFromString({ componentId, contextElement, expression, disableFunctionCall = false, waitPromise = 'recursive' }) {
    expression = expression.trim();
    if (!expression) {
        return (handler) => {
            handler && handler(null);
            return null;
        };
    }
    let runFunction = (handler, target, params, contexts, forwardSyntaxErrors = true, waitMessage) => {
        var _a;
        let component = FindComponentById(componentId), proxy = component === null || component === void 0 ? void 0 : component.GetRootProxy().GetNative();
        if (!proxy || ((_a = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.IsDestroyed())) {
            return;
        }
        let { context = null, changes = null } = ((component === null || component === void 0 ? void 0 : component.GetBackend()) || {});
        context === null || context === void 0 ? void 0 : context.Push(ContextKeys.self, contextElement);
        changes === null || changes === void 0 ? void 0 : changes.ResetLastAccessContext();
        PushCurrentComponent(componentId);
        Object.entries(contexts || {}).forEach(([key, value]) => context === null || context === void 0 ? void 0 : context.Push(key, value));
        try {
            let result = target(proxy);
            if (GetGlobal().IsFuture(result)) {
                result = result.Get();
            }
            if (!handler) {
                return (disableFunctionCall ? result : CallIfFunction(result, handler, componentId, params));
            }
            let handleResult = (value) => {
                if (value && waitPromise !== 'none') {
                    WaitPromise(value, handler, waitPromise === 'recursive');
                    return (waitMessage || 'Loading data...');
                }
                else { //Immediate
                    handler(value);
                }
            };
            if (!disableFunctionCall) {
                CallIfFunction(result, handleResult, componentId, params);
            }
            else { //No function check
                handleResult(result);
            }
        }
        catch (err) {
            if (!forwardSyntaxErrors || !(err instanceof SyntaxError)) {
                JournalError(err, `InlineJs.Region<${componentId}>.RunFunction('${expression}')`);
            }
            else { //Forward syntax errors
                throw err;
            }
        }
        finally { //Revert changes
            Object.entries(contexts || {}).forEach(([key, value]) => context === null || context === void 0 ? void 0 : context.Pop(key, value));
            PopCurrentComponent();
            context === null || context === void 0 ? void 0 : context.Pop(ContextKeys.self);
        }
    };
    let valueReturnFunction = GenerateValueReturningFunction(expression, componentId), voidFunction = null;
    if (!valueReturnFunction) {
        voidFunction = GenerateVoidFunction(expression, componentId);
    }
    return (handler, params = [], contexts, waitMessage) => {
        if (!voidFunction && valueReturnFunction) {
            try {
                return runFunction(handler, valueReturnFunction.bind(contextElement), (params || []), (contexts || {}), undefined, waitMessage);
            }
            catch (err) {
                if (err instanceof SyntaxError) {
                    voidFunction = GenerateVoidFunction(expression, componentId);
                }
                else {
                    throw err;
                }
            }
        }
        if (voidFunction) {
            return (runFunction(handler, voidFunction.bind(contextElement), (params || []), (contexts || {}), false) || null);
        }
        handler && handler(null);
        return null;
    };
}
