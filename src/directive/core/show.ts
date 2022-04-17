import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { LazyCheck } from "../lazy";
import { TransitionCheck } from "../transition";

export const ShowDirectiveHandler = CreateDirectiveHandlerCallback('show', ({ componentId, contextElement, ...rest }) => {
    let firstEntry = true, lastValue = false, apply = (value: any) => {
        if (!firstEntry && !!value === lastValue){
            return;
        }

        let show = () => {
            if (contextElement.style.length === 1 && contextElement.style.display === 'none') {
                contextElement.removeAttribute('style');
            }
            else{
                contextElement.style.removeProperty('display');
            }
        };

        if (!firstEntry || value){//Apply applicable transitions if not first entry or value is truthy
            TransitionCheck({ componentId, contextElement,
                callback: () => (value ? show() : (contextElement.style.display = 'none')),
                reverse: !value,
            });
        }
        else{//First entry and value is not truthy
            contextElement.style.display = 'none';
        }

        firstEntry = false;
        lastValue = !!value;
    };

    LazyCheck({ componentId, contextElement, ...rest,
        callback: apply,
    });
});

export function ShowDirectiveHandlerCompact(){
    AddDirectiveHandler(ShowDirectiveHandler);
}
