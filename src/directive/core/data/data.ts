import { PopCurrentComponent, PushCurrentComponent } from "../../../component/current";
import { PopCurrentScope, PushCurrentScope } from "../../../component/current-scope";
import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { JournalError } from "../../../journal/error";
import { JournalTry } from "../../../journal/try";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../../proxy/create";
import { ReactiveStateType } from "../../../types/config";
import { ContextKeys } from "../../../utilities/context-keys";
import { GetTarget } from "../../../utilities/get-target";
import { IsObject } from "../../../utilities/is-object";
import { Nothing } from "../../../values/nothing";

interface IDataConfigDetails{
    reactiveState?: ReactiveStateType;
    name?: string;
    locals?: Record<string, any>;
    init?: () => void;
    uninit?: () => void;
    post?: () => void;
}

export const DataDirectiveHandler = CreateDirectiveHandlerCallback('data', ({ componentId, contextElement, expression }) => {
    EvaluateLater({ componentId, contextElement, expression })((data) => {
        let component = FindComponentById(componentId), elementScope = component?.FindElementScope(contextElement);
        if (!component || !elementScope){
            return;
        }
        
        data = GetTarget(data);
        data = ((IsObject(data) && data) || {});

        let config: IDataConfigDetails | null = null;
        if ('$config' in data){
            config = data['$config'];
            delete data['$config'];
        }

        if (IsObject(config?.locals)){
            Object.entries(config!.locals!).forEach(([key, value]) => elementScope!.SetLocal(key, value));
        }
        
        let proxy = component.GetRootProxy().GetNative(), proxyTarget = GetTarget(proxy), target: Record<string, any>, key = `$${ContextKeys.scope}`;
        if (component.GetRoot() !== contextElement){//Add new scope
            let scope = component.CreateScope(contextElement);
            if (!scope){
                JournalError('Failed to create component scope.', 'DataDirectiveHandler', contextElement);
                return;
            }

            let scopeId = scope.GetId();
            if (config?.name){
                scope.SetName(config.name);
            }

            PushCurrentScope(component, scopeId);
            elementScope.AddPostProcessCallback(() => PopCurrentScope(componentId));
            
            target = {};
            proxy[scopeId] = target;

            let methods = {
                name: () => FindComponentById(componentId)?.FindScopeById(scopeId)?.GetName(),
                parent: () => {
                    let component = FindComponentById(componentId), parent = component?.FindElementLocalValue((component?.FindAncestor(contextElement) || ''), key, true);
                    return ((parent && !(parent instanceof Nothing)) ? parent : null);
                },
                data: () => (FindComponentById(componentId)?.GetRootProxy().GetNative()[scopeId] || {}),
            }, local = CreateInplaceProxy(BuildGetterProxyOptions({ getter: (prop) => (prop && methods.hasOwnProperty(prop) && methods[prop]()), lookup: [...Object.keys(methods)]}));

            elementScope.SetLocal(key, local);
            elementScope.AddUninitCallback(() => FindComponentById(componentId)?.RemoveScope(scopeId));
        }
        else{//Root scope
            target = proxyTarget;
            elementScope.SetLocal(key, proxy);
            
            if (config?.reactiveState){
                component.SetReactiveState(config.reactiveState);
            }

            if (config?.name){
                component.SetName(config.name);
            }
        }

        Object.entries(data).forEach(([key, value]) => (target[key] = value));
        if (config?.init){//Evaluate init callback
            let { context } = component.GetBackend();
            
            context.Push(ContextKeys.self, contextElement);
            PushCurrentComponent(componentId);
            
            JournalTry(() => config!.init!.call(proxy), 'DataDirectiveHandler.Init', contextElement);

            PopCurrentComponent();
            context.Pop(ContextKeys.self);
        }

        if (config?.uninit){
            elementScope.AddUninitCallback(() => {
                let component = FindComponentById(componentId);
                if (!component){
                    return;
                }

                let { context } = component.GetBackend(), proxy = component.GetRootProxy().GetNative();
            
                context.Push(ContextKeys.self, contextElement);
                PushCurrentComponent(componentId);
                
                JournalTry(() => config!.uninit!.call(proxy), 'DataDirectiveHandler.Uninit', contextElement);

                PopCurrentComponent();
                context.Pop(ContextKeys.self);
            });
        }
    });
});

export function DataDirectiveHandlerCompact(){
    AddDirectiveHandler(DataDirectiveHandler);
}
