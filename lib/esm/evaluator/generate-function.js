import { PopCurrentComponent, PushCurrentComponent } from "../component/current";
import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { FindCacheValue, SetCacheValue } from "../utilities/cache";
import { ContextKeys } from "../utilities/context-keys";
import { WaitPromise } from "./wait-promise";
const InlineJSContextKey = '__InlineJS_Context__';
const cacheKey = 'InlineJS_Func_Cache';
function GetDefaultCacheValue() {
    return {};
}
function GenerateFunction(body, expression, componentId, alertAlways = false) {
    const cached = FindCacheValue(cacheKey, expression);
    if (cached) {
        return cached;
    }
    try {
        const newFunction = (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                ${body(expression)};
            };
        `));
        SetCacheValue(cacheKey, expression, newFunction, GetDefaultCacheValue());
        return newFunction;
    }
    catch (err) {
        if (alertAlways || !(err instanceof SyntaxError)) {
            JournalError(err, `InlineJs.Region<${componentId || 'NIL'}>.GenerateFunction`);
            return undefined;
        }
    }
    return null;
}
export function GenerateValueReturningFunction(expression, componentId, alertAlways = false) {
    return GenerateFunction(expression => `return (${expression})`, expression, componentId, alertAlways);
}
export function GenerateVoidFunction(expression, componentId, alertAlways = false) {
    return GenerateFunction(expression => expression, expression, componentId, alertAlways);
}
export function CallIfFunction(value, handler, componentId, params = []) {
    var _a;
    if (typeof value === 'function') { //Call function
        const component = FindComponentById(componentId || ''), lastContext = component === null || component === void 0 ? void 0 : component.FindProxy(component === null || component === void 0 ? void 0 : component.GetBackend().changes.GetLastAccessContext());
        const result = value.apply((((_a = (lastContext || (component === null || component === void 0 ? void 0 : component.GetRootProxy()))) === null || _a === void 0 ? void 0 : _a.GetNative()) || null), (params || []));
        return (handler ? handler(result) : result);
    }
    return (handler ? handler(value) : value);
}
export function GenerateFunctionFromString({ componentId, contextElement, expression, disableFunctionCall = false, waitPromise = 'recursive', voidOnly }) {
    const nullHandler = (handler) => {
        handler && handler(null);
        return null;
    };
    expression = expression.trim();
    if (!expression) {
        return nullHandler;
    }
    let func = (voidOnly ? null : GenerateValueReturningFunction(expression, componentId)), voidGenerated = false;
    if (func === undefined) { //Not a syntax error
        return nullHandler;
    }
    !func && (voidGenerated = true);
    if (!func && !(func = GenerateVoidFunction(expression, componentId, true))) { //Failed to generate function
        return nullHandler;
    }
    const runFunction = (handler, target, params, contexts, forwardSyntaxErrors = true, waitMessage) => {
        var _a;
        const component = FindComponentById(componentId), proxy = component === null || component === void 0 ? void 0 : component.GetRootProxy().GetNative();
        if (!proxy || ((_a = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.IsDestroyed())) {
            return;
        }
        const { context = null, changes = null } = ((component === null || component === void 0 ? void 0 : component.GetBackend()) || {});
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
            const handleResult = (value) => {
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
    return (handler, params = [], contexts, waitMessage) => {
        try {
            return runFunction(handler, func.bind(contextElement), (params || []), (contexts || {}), undefined, waitMessage);
        }
        catch (err) {
            if (err instanceof SyntaxError && !voidGenerated) {
                voidGenerated = true;
                func = GenerateVoidFunction(expression, componentId, true);
                if (!func) {
                    return nullHandler(handler);
                }
                return runFunction(handler, func.bind(contextElement), (params || []), (contexts || {}), false);
            }
            else {
                JournalError(err, `InlineJs.Region<${componentId}>.RunFunction('${expression}')`);
            }
        }
        return nullHandler(handler);
    };
}
