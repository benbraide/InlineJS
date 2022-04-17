import { PopCurrentComponent, PushCurrentComponent } from "../component/current";
import { FindComponentById } from "../component/find";
import { JournalError } from "../journal/error";
import { IEvaluateOptions } from "../types/evaluate-options";
import { ContextKeys } from "../utilities/context-keys";

const InlineJSContextKey = '__InlineJS_Context__';

export function GenerateValueReturningFunction(expression: string, contextElement: HTMLElement, componentId?: string){
    try{
        return (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                return (${expression});
            };
        `)).bind(contextElement);
    }
    catch (err){
        if (!(err instanceof SyntaxError)){
            JournalError(err, `InlineJs.Region<${componentId || 'NIL'}>.GenerateValueReturningFunction`);
        }
    }

    return null;
}

export function GenerateVoidFunction(expression: string, contextElement: HTMLElement, componentId?: string){
    try{
        return (new Function(InlineJSContextKey, `
            with (${InlineJSContextKey}){
                ${expression};
            };
        `)).bind(contextElement);
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

export function WaitPromise(value: Promise<any>, handler: (value: any) => void, recursive?: boolean){
    if (recursive){
        value.then((value) => {
            if (value instanceof Promise){
                WaitPromise(value, handler, true);
            }
            else{//Immediate
                handler(value);
            }
        });
    }
    else{//Wait one
        value.then(handler);
    }
}

export type GeneratedFunctionType = (handler?: (value: any) => void, params?: Array<any>, contexts?: Record<string, any>) => any;

export function GenerateFunctionFromString({ componentId, contextElement, expression, disableFunctionCall = false, waitPromise = 'recursive' }: IEvaluateOptions): GeneratedFunctionType{
    expression = expression.trim();

    let runFunction = (handler?: ((value: any) => void) | undefined, target?: any, params?: Array<any>, contexts?: Record<string, any>, forwardSyntaxErrors = true) => {
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
            if (!handler){
                return (disableFunctionCall ? result : CallIfFunction(result, handler, componentId, params));
            }

            let handleResult = (value: any) => {
                if (waitPromise !== 'none' && value instanceof Promise){
                    WaitPromise(value, handler, waitPromise === 'recursive');
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

    let valueReturnFunction = (expression ? GenerateValueReturningFunction(expression, contextElement, componentId) : null), voidFunction: any = null;
    if (expression && typeof valueReturnFunction !== 'function'){
        voidFunction = GenerateVoidFunction(expression, contextElement, componentId);
    }
    
    return (handler?: (value: any) => void, params: Array<any> = [], contexts?: Record<string, any>) => {
        if (!voidFunction && valueReturnFunction){
            try{
                return runFunction(handler, valueReturnFunction, (params || []), (contexts || {}));
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

        return (handler ? handler(null) : null);
    };
}
