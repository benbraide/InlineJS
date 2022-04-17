import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { GetGlobal } from "../../../global/get";
import { ToString } from "../../../utilities/to-string";
import { FindComponentById } from "../../../component/find";
import { ResolveKeyValue } from "../../key-value";
import { ResolveOptions } from "../../options";
import { ToCamelCase } from "../../../utilities/camel-case";

export const BindDirectiveHandler = CreateDirectiveHandlerCallback('bind', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    argKey = argKey.trim();
    if (argKey === 'key'){
        return (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.SetKey(expression);
    }

    let options = ResolveOptions({ options: { camel: false }, list: argOptions});
    ResolveKeyValue({ componentId, contextElement, expression,
        key: argKey,
        callback: ([key, value]) => {
            key = (options.camel ? ToCamelCase(key) : key);
            let isBoolean = GetGlobal().GetConfig().IsBooleanAttribute(key);
            if (value || ((value === 0 || value === '') && !isBoolean)){//Set
                contextElement.setAttribute(key, (isBoolean ? key : ToString(value)));
            }
            else{//Remove
                contextElement.removeAttribute(key);
            }
        },
    });
});

export function BindDirectiveExpansionRule(name: string){
    return (name.startsWith(':') ? (GetGlobal().GetConfig().GetDirectiveName('bind') + name) : null);
}

export function BindDirectiveHandlerCompact(){
    AddDirectiveHandler(BindDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(BindDirectiveExpansionRule);
}
