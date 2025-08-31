"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateFunctionFromString = exports.CallIfFunction = exports.GenerateVoidFunction = exports.GenerateValueReturningFunction = void 0;
const current_1 = require("../component/current");
const find_1 = require("../component/find");
const get_1 = require("../global/get");
const error_1 = require("../journal/error");
const cache_1 = require("../utilities/cache");
const context_keys_1 = require("../utilities/context-keys");
const wait_promise_1 = require("./wait-promise");
const InlineJSContextKey = '__InlineJS_Context__';
const cacheKey = 'InlineJS_Func_Cache';
function GetDefaultCacheValue() {
    return {};
}
function GenerateFunction(body, expression, componentId, alertAlways = false) {
    const cached = (0, cache_1.FindCacheValue)(cacheKey, expression);
    if (cached) {
        return cached;
    }
    try {
        const newFunction = (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                ${body(expression)};
            };
        `));
        (0, cache_1.SetCacheValue)(cacheKey, expression, newFunction, GetDefaultCacheValue());
        return newFunction;
    }
    catch (err) {
        if (alertAlways || !(err instanceof SyntaxError)) {
            (0, error_1.JournalError)(err, `InlineJs.Region<${componentId || 'NIL'}>.GenerateFunction`);
            return undefined;
        }
    }
    return null;
}
function GenerateValueReturningFunction(expression, componentId, alertAlways = false) {
    return GenerateFunction(expression => `return (${expression})`, expression, componentId, alertAlways);
}
exports.GenerateValueReturningFunction = GenerateValueReturningFunction;
function GenerateVoidFunction(expression, componentId, alertAlways = false) {
    return GenerateFunction(expression => expression, expression, componentId, alertAlways);
}
exports.GenerateVoidFunction = GenerateVoidFunction;
function CallIfFunction(value, handler, componentId, params = []) {
    if (typeof value === 'function') { //Call function
        const result = value(...params);
        return (handler ? handler(result) : result);
    }
    return (handler ? handler(value) : value);
}
exports.CallIfFunction = CallIfFunction;
function GenerateFunctionFromString({ componentId, contextElement, expression, disableFunctionCall = false, waitPromise = 'recursive', voidOnly }) {
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
    const runFunction = (target, handler, params, contexts, forwardSyntaxErrors = true, waitMessage) => {
        var _a;
        const component = (0, find_1.FindComponentById)(componentId), proxy = component === null || component === void 0 ? void 0 : component.GetRootProxy().GetNative();
        if (!proxy || ((_a = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.IsDestroyed())) {
            return;
        }
        const { context = null, changes = null } = ((component === null || component === void 0 ? void 0 : component.GetBackend()) || {});
        context === null || context === void 0 ? void 0 : context.Push(context_keys_1.ContextKeys.self, contextElement);
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
            const handleResult = (value) => {
                if (value && waitPromise !== 'none') {
                    (0, wait_promise_1.WaitPromise)(value, handler, waitPromise === 'recursive');
                    return (waitMessage || 'Loading data...');
                }
                else { //Immediate
                    handler(value);
                }
            };
            if (!disableFunctionCall) {
                return CallIfFunction(result, handleResult, componentId, params);
            }
            return handleResult(result); //No function check
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
    return (handler, params = [], contexts, waitMessage) => {
        var _a;
        if (!func || (contextElement && !contextElement.isConnected)) {
            return nullHandler(handler);
        }
        const scope = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement);
        if (scope === null || scope === void 0 ? void 0 : scope.IsMarked()) {
            return nullHandler(handler);
        }
        try {
            return runFunction(func.bind(contextElement), handler, (params || []), (contexts || {}), undefined, waitMessage);
        }
        catch (err) {
            if (err instanceof SyntaxError && !voidGenerated) {
                voidGenerated = true;
                func = GenerateVoidFunction(expression, componentId, true);
                if (!func) {
                    return nullHandler(handler);
                }
                return runFunction(func.bind(contextElement), handler, (params || []), (contexts || {}), false);
            }
            else {
                (0, error_1.JournalError)(err, `InlineJs.Region<${componentId}>.RunFunction('${expression}')`);
            }
        }
        return nullHandler(handler);
    };
}
exports.GenerateFunctionFromString = GenerateFunctionFromString;
