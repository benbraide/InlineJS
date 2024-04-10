import { PopCurrentComponent, PushCurrentComponent } from "../component/current";
import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { IEvaluateOptions } from "../types/evaluate-options";
import { FindCacheValue, SetCacheValue } from "../utilities/cache";
import { ContextKeys } from "../utilities/context-keys";
import { WaitPromise } from "./wait-promise";

const InlineJSContextKey = '__InlineJS_Context__';

const cacheKey = 'InlineJS_Func_Cache';
function GetDefaultCacheValue(): Record<string, Function>{
    return {};
}

function GenerateFunction(body: (expression: string) => string, expression: string, componentId?: string, alertAlways = false){
    const cached = FindCacheValue<Function>(cacheKey, expression);
    if (cached){
        return cached;
    }

    try{
        const newFunction = (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                ${body(expression)};
            };
        `));

        SetCacheValue(cacheKey, expression, newFunction, GetDefaultCacheValue());
        return newFunction;
    }
    catch (err){
        if (alertAlways || !(err instanceof SyntaxError)){
            JournalError(err, `InlineJs.Region<${componentId || 'NIL'}>.GenerateFunction`);
            return undefined;
        }
    }

    return null;
}

export function GenerateValueReturningFunction(expression: string, componentId?: string, alertAlways = false){
    return GenerateFunction(expression => `return (${expression})`, expression, componentId, alertAlways);
}

export function GenerateVoidFunction(expression: string, componentId?: string, alertAlways = false){
    return GenerateFunction(expression => expression, expression, componentId, alertAlways);
}

export function CallIfFunction(value: any, handler?: (value: any) => void, componentId?: string, params: Array<any> = []){
    if (typeof value === 'function'){//Call function
        const component = FindComponentById(componentId || ''), lastContext = component?.FindProxy(component?.GetBackend().changes.GetLastAccessContext());
        const result = value.apply(((lastContext || component?.GetRootProxy())?.GetNative() || null), (params || []));
        return (handler ? handler(result) : result);
    }

    return (handler ? handler(value) : value);
}

export type GeneratedFunctionType = (handler?: (value: any) => void, params?: Array<any>, contexts?: Record<string, any>) => any;

export function GenerateFunctionFromString({ componentId, contextElement, expression, disableFunctionCall = false, waitPromise = 'recursive', voidOnly }: IEvaluateOptions): GeneratedFunctionType{
    const nullHandler = (handler?: (value: any) => void) => {
        handler && handler(null);
        return null;
    };
    
    expression = expression.trim();
    if (!expression){
        return nullHandler;
    }

    let func = (voidOnly ? null : GenerateValueReturningFunction(expression, componentId)), voidGenerated = false;
    if (func === undefined){//Not a syntax error
        return nullHandler;
    }

    !func && (voidGenerated = true);
    if (!func && !(func = GenerateVoidFunction(expression, componentId, true))){//Failed to generate function
        return nullHandler;
    }

    const runFunction = (handler?: ((value: any) => void) | undefined, target?: any, params?: Array<any>, contexts?: Record<string, any>, forwardSyntaxErrors = true, waitMessage?: string) => {
        const component = FindComponentById(componentId), proxy = component?.GetRootProxy().GetNative();
        if (!proxy || component?.FindElementScope(contextElement)?.IsDestroyed()){
            return;
        }

        const { context = null, changes = null } = (component?.GetBackend() || {});

        context?.Push(ContextKeys.self, contextElement);
        changes?.ResetLastAccessContext();
        
        PushCurrentComponent(componentId);
        Object.entries(contexts || {}).forEach(([key, value]) => context?.Push(key, value));
        
        try{
            let result = target(proxy);
            if (GetGlobal().IsFuture(result)){
                result = result.Get();
            }
            
            if (!handler){
                return (disableFunctionCall ? result : CallIfFunction(result, handler, componentId, params));
            }

            const handleResult = (value: any) => {
                if (value && waitPromise !== 'none'){
                    WaitPromise(value, handler, waitPromise === 'recursive');
                    return (waitMessage || 'Loading data...');
                }
                else{//Immediate
                    handler(value);
                }
            }

            if (!disableFunctionCall){
                CallIfFunction(result, handleResult, componentId, params);
            }
            else{//No function check
                handleResult(result);
            }
        }
        catch (err){
            if (!forwardSyntaxErrors || !(err instanceof SyntaxError)){
                JournalError(err, `InlineJs.Region<${componentId}>.RunFunction('${expression}')`);
            }
            else{//Forward syntax errors
                throw err;
            }
        }
        finally{//Revert changes
            Object.entries(contexts || {}).forEach(([key, value]) => context?.Pop(key, value));
            PopCurrentComponent();
            context?.Pop(ContextKeys.self);
        }
    };
    
    return (handler?: (value: any) => void, params: Array<any> = [], contexts?: Record<string, any>, waitMessage?: string) => {
        try{
            return runFunction(handler, func!.bind(contextElement), (params || []), (contexts || {}), undefined, waitMessage);
        }
        catch (err){
            if (err instanceof SyntaxError && !voidGenerated){
                voidGenerated = true;
                func = GenerateVoidFunction(expression, componentId, true);
                if (!func){
                    return nullHandler(handler);
                }

                return runFunction(handler, func!.bind(contextElement), (params || []), (contexts || {}), false);
            }
            else{
                JournalError(err, `InlineJs.Region<${componentId}>.RunFunction('${expression}')`);
            }
        }

        return nullHandler(handler);
    };
}
