"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateFunctionFromString = exports.CallIfFunction = exports.GenerateVoidFunction = exports.GenerateValueReturningFunction = void 0;
const current_1 = require("../component/current");
const find_1 = require("../component/find");
const get_1 = require("../global/get");
const error_1 = require("../journal/error");
const context_keys_1 = require("../utilities/context-keys");
const wait_promise_1 = require("./wait-promise");
const InlineJSContextKey = '__InlineJS_Context__';
function GenerateValueReturningFunction(expression, contextElement, componentId) {
    try {
        return (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                return (${expression});
            };
        `)).bind(contextElement);
    }
    catch (err) {
        if (!(err instanceof SyntaxError)) {
            (0, error_1.JournalError)(err, `InlineJs.Region<${componentId || 'NIL'}>.GenerateValueReturningFunction`);
        }
    }
    return null;
}
exports.GenerateValueReturningFunction = GenerateValueReturningFunction;
function GenerateVoidFunction(expression, contextElement, componentId) {
    try {
        return (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                ${expression};
            };
        `)).bind(contextElement);
    }
    catch (err) {
        (0, error_1.JournalError)(err, `InlineJs.Region<${componentId || 'NIL'}>.GenerateVoidFunction`);
    }
    return null;
}
exports.GenerateVoidFunction = GenerateVoidFunction;
function CallIfFunction(value, handler, componentId, params = []) {
    var _a;
    if (typeof value === 'function') { //Call function
        let component = (0, find_1.FindComponentById)(componentId || ''), lastContext = component === null || component === void 0 ? void 0 : component.FindProxy(component === null || component === void 0 ? void 0 : component.GetBackend().changes.GetLastAccessContext());
        let result = value.apply((((_a = (lastContext || (component === null || component === void 0 ? void 0 : component.GetRootProxy()))) === null || _a === void 0 ? void 0 : _a.GetNative()) || null), (params || []));
        return (handler ? handler(result) : result);
    }
    return (handler ? handler(value) : value);
}
exports.CallIfFunction = CallIfFunction;
function GenerateFunctionFromString({ componentId, contextElement, expression, disableFunctionCall = false, waitPromise = 'recursive' }) {
    expression = expression.trim();
    if (!expression) {
        return (handler, params = [], contexts) => {
            return (handler ? handler(null) : null);
        };
    }
    let runFunction = (handler, target, params, contexts, forwardSyntaxErrors = true) => {
        var _a;
        let component = (0, find_1.FindComponentById)(componentId), proxy = component === null || component === void 0 ? void 0 : component.GetRootProxy().GetNative();
        if (!proxy || ((_a = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.IsDestroyed())) {
            return;
        }
        let { context = null, changes = null } = ((component === null || component === void 0 ? void 0 : component.GetBackend()) || {});
        context === null || context === void 0 ? void 0 : context.Push(context_keys_1.ContextKeys.self, contextElement);
        changes === null || changes === void 0 ? void 0 : changes.ResetLastAccessContext();
        (0, current_1.PushCurrentComponent)(componentId);
        Object.entries(contexts || {}).forEach(([key, value]) => context === null || context === void 0 ? void 0 : context.Push(key, value));
        try {
            let result = target(proxy);
            if ((0, get_1.GetGlobal)().IsFuture(result)) {
                result = result.Get();
            }
            if (!handler) {
                return (disableFunctionCall ? result : CallIfFunction(result, handler, componentId, params));
            }
            let handleResult = (value) => {
                if (waitPromise !== 'none') {
                    (0, wait_promise_1.WaitPromise)(value, handler, waitPromise === 'recursive');
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
                (0, error_1.JournalError)(err, `InlineJs.Region<${componentId}>.RunFunction('${expression}')`);
            }
            else { //Forward syntax errors
                throw err;
            }
        }
        finally { //Revert changes
            Object.entries(contexts || {}).forEach(([key, value]) => context === null || context === void 0 ? void 0 : context.Pop(key, value));
            (0, current_1.PopCurrentComponent)();
            context === null || context === void 0 ? void 0 : context.Pop(context_keys_1.ContextKeys.self);
        }
    };
    let valueReturnFunction = GenerateValueReturningFunction(expression, contextElement, componentId), voidFunction = null;
    if (!valueReturnFunction) {
        voidFunction = GenerateVoidFunction(expression, contextElement, componentId);
    }
    return (handler, params = [], contexts) => {
        if (!voidFunction && valueReturnFunction) {
            try {
                return runFunction(handler, valueReturnFunction, (params || []), (contexts || {}));
            }
            catch (err) {
                if (err instanceof SyntaxError) {
                    voidFunction = GenerateVoidFunction(expression, contextElement, componentId);
                }
                else {
                    throw err;
                }
            }
        }
        if (voidFunction) {
            return (runFunction(handler, voidFunction, (params || []), (contexts || {}), false) || null);
        }
        return (handler ? handler(null) : null);
    };
}
exports.GenerateFunctionFromString = GenerateFunctionFromString;
