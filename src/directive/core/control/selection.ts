import { FindComponentById } from "../../../component/find";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { JournalError } from "../../../journal/error";
import { ISelectionScope } from "../../../types/selection";
import { TransitionCheck } from "../../transition";
import { InitControl } from "./init";
import { InsertControlClone } from "./insert";

export function CreateSelectionDirectiveHandler(isElse: boolean){
    return CreateDirectiveHandlerCallback((isElse ? 'else' : 'if'), ({ componentId, component, contextElement, expression, ...rest }) => {
        let resolvedComponent = (component || FindComponentById(componentId)), selectionScopeStackEntry = resolvedComponent?.PeekSelectionScope();
        if (isElse && (!selectionScopeStackEntry?.scope || !selectionScopeStackEntry?.set)){
            return JournalError('Missing matching \'if\' statement.', 'ElseDirectiveHandler', contextElement);
        }

        expression = expression.trim();
        
        let lastValue = false, lastEffectValue: any = null, lastState = !!selectionScopeStackEntry?.scope?.state;
        let firstEntry = true, init = InitControl({ componentId, component, contextElement, expression, ...rest });
        if (!init){//Failed to initialize
            return;
        }

        if (!expression && isElse){//Evaluates to true
            init.effect = handler => handler(true);
        }
    
        let clone: HTMLElement | null = null, insert = () => InsertControlClone({ componentId, contextElement,
            parent: init!.parent,
            clone: (clone = init!.clone()),
            relativeType: 'before',
            relative: contextElement,
        });
    
        let remove = () => {
            if (clone && clone.parentElement){//Remove from DOM and destroy scope on next tick
                let cloneCopy: HTMLElement | null = clone;
    
                clone.remove();
                clone = null;
    
                FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => {
                    FindComponentById(componentId)?.FindElementScope(cloneCopy!)?.Destroy();
                    cloneCopy = null;
                });
            }
        };

        let effect = (value: any) => {
            let pred = (!!value && !lastState);
            if ((firstEntry && pred) || (pred !== lastValue)){//Apply applicable transitions if not first entry or value is truthy
                TransitionCheck({ componentId, contextElement,
                    callback: () => (pred ? insert() : remove()),
                    reverse: !pred,
                });
            }
    
            lastEffectValue = value;
            firstEntry = false;
            lastValue = pred;

            if (selectionScope){
                selectionScope.state = (!!value || lastState);
                if (selectionScope.callback){
                    selectionScope.callback(selectionScope.state);
                }
            }
        };
    
        let elementScope = resolvedComponent?.FindElementScope(contextElement), selectionScope: ISelectionScope | null = null;

        elementScope?.AddUninitCallback(remove);
        if (selectionScopeStackEntry){
            if (isElse){//Listen for state change
                selectionScopeStackEntry.scope!.callback = (state) => {
                    lastState = state;
                    effect(lastEffectValue);
                };
            }
            
            if (!isElse || expression){//Create new scope
                selectionScopeStackEntry.scope = (selectionScope = {
                    state: lastState,
                });
                selectionScopeStackEntry.set = true;
            }
        }

        init!.effect(effect);
    });
}
