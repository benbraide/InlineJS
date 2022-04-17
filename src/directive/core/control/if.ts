import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { TransitionCheck } from "../../transition";
import { InitControl } from "./init";
import { InsertControlClone } from "./insert";

export const IfDirectiveHandler = CreateDirectiveHandlerCallback('if', ({ componentId, component, contextElement, ...rest }) => {
    let firstEntry = true, lastValue = false, init = InitControl({ componentId, component, contextElement, ...rest });
    if (!init){//Failed to initialize
        return;
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

    let elementScope = (component || FindComponentById(componentId))?.FindElementScope(contextElement);
    elementScope?.AddUninitCallback(remove);
    elementScope?.AddPostProcessCallback(() => {
        init!.effect((value) => {
            if (!firstEntry || (!!value !== lastValue)){//Apply applicable transitions if not first entry or value is truthy
                TransitionCheck({ componentId, contextElement,
                    callback: () => (value ? insert() : remove()),
                    reverse: !value,
                });
            }
    
            firstEntry = false;
            lastValue = !!value;
        });
    });
});

export function IfDirectiveHandlerCompact(){
    AddDirectiveHandler(IfDirectiveHandler);
}
