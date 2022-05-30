import { PopCurrentComponent, PushCurrentComponent } from "../component/current";
import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { JournalError } from "../journal/error";
import { IEvaluateOptions } from "../types/evaluate-options";
import { ContextKeys } from "../utilities/context-keys";
import { WaitPromise } from "./wait-promise";

const InlineJSContextKey = '__InlineJS_Context__';

let InlineJSValueFunctions: Record<string, any> = {};
let InlineJSVoidFunctions: Record<string, any> = {};

export function GenerateValueReturningFunction(expression: string, contextElement: HTMLElement, componentId?: string){
    if (InlineJSValueFunctions.hasOwnProperty(expression)){
        return InlineJSValueFunctions[expression];
    }

    if (InlineJSVoidFunctions.hasOwnProperty(expression)){
        return null;//Prevent retries when a void version exists
    }
    
    try{
        let newFunction = (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                return (${expression});
            };
        `)).bind(contextElement);

        return (InlineJSValueFunctions[expression] = newFunction);
    }
    catch (err){
        if (!(err instanceof SyntaxError)){
            JournalError(err, `InlineJs.Region<${componentId || 'NIL'}>.GenerateValueReturningFunction`);
        }
    }

    return null;
}

export function GenerateVoidFunction(expression: string, contextElement: HTMLElement, componentId?: string){
    if (InlineJSVoidFunctions.hasOwnProperty(expression)){
        return InlineJSVoidFunctions[expression];
    }
    
    try{
        let newFunction = (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                ${expression};
            };
        `)).bind(contextElement);

        return (InlineJSVoidFunctions[expression] = newFunction);
    }
    catch (err){
        JournalError(err, `InlineJs.Region<${componentId || 'NIL'}>.GenerateVoidFunction`);
    }

    return null;
}

export function CallIfFunction(value: any, handler?: (value: any) => void, componentId?: string, params: Array<any> = []){
    if (typeof value === 'function'){//Call function
        let component = FindComponentById(componentId || ''), lastContext = component?.FindProxy(component?.GetBackend().changes.GetLastAccessContext());
        let result = value.apply(((lastContext || component?.GetRootProxy())?.GetNative() || null), (params || []));
        return (handler ? handler(result) : result);
    }

    return (handler ? handler(value) : value);
}

export type GeneratedFunctionType = (handler?: (value: any) => void, params?: Array<any>, contexts?: Record<string, any>) => any;

export function GenerateFunctionFromString({ componentId, contextElement, expression, disableFunctionCall = false, waitPromise = 'recursive' }: IEvaluateOptions): GeneratedFunctionType{
    expression = expression.trim();
    if (!expression){
        return (handler?: (value: any) => void) => {
            handler && handler(null);
            return null;
        };
    }

    let runFunction = (handler?: ((value: any) => void) | undefined, target?: any, params?: Array<any>, contexts?: Record<string, any>, forwardSyntaxErrors = true, waitMessage?: string) => {
        let component = FindComponentById(componentId), proxy = component?.GetRootProxy().GetNative();
        if (!proxy || component?.FindElementScope(contextElement)?.IsDestroyed()){
            return;
        }

        let { context = null, changes = null } = (component?.GetBackend() || {});

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

            let handleResult = (value: any) => {
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

    let valueReturnFunction = GenerateValueReturningFunction(expression, contextElement, componentId), voidFunction: any = null;
    if (!valueReturnFunction){
        voidFunction = GenerateVoidFunction(expression, contextElement, componentId);
    }
    
    return (handler?: (value: any) => void, params: Array<any> = [], contexts?: Record<string, any>, waitMessage?: string) => {
        if (!voidFunction && valueReturnFunction){
            try{
                return runFunction(handler, valueReturnFunction, (params || []), (contexts || {}), undefined, waitMessage);
            }
            catch (err){
                if (err instanceof SyntaxError){
                    voidFunction = GenerateVoidFunction(expression, contextElement, componentId);
                }
                else{
                    throw err;
                }
            }
        }
        
        if (voidFunction){
            return (runFunction(handler, voidFunction, (params || []), (contexts || {}), false) || null);
        }

        handler && handler(null);

        return null;
    };
}
