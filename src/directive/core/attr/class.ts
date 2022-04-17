import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { GetGlobal } from "../../../global/get";
import { ToString } from "../../../utilities/to-string";
import { ResolveKeyValue } from "../../key-value";

export const ClassDirectiveHandler = CreateDirectiveHandlerCallback('class', ({ componentId, contextElement, expression, argKey }) => {
    let split = (key: string) => key.split(' ').filter(item => !!item), previousList: Array<string> | null = null;
    let add = (key: string) => contextElement.classList.add(key), remove = (key: string) => (contextElement.classList.contains(key) && contextElement.classList.remove(key));
    
    ResolveKeyValue({ componentId, contextElement, expression,
        key: argKey.trim(),
        callback: ([key, value]) => split(key).forEach(value ? add : remove),
        arrayCallback: (list) => {
            let validList = list.map(item => ToString(item)).filter(item => !!item);
            (previousList || []).filter(item => !validList.includes(item)).forEach(remove);
            (previousList ? validList.filter(item => !previousList!.includes(item)) : validList).forEach(add);
            previousList = validList;
        },
    });
});

export function ClassDirectiveExpansionRule(name: string){
    return (name.startsWith('.') ? name.replace('.', GetGlobal().GetConfig().GetDirectiveName('class:')) : null);
}

export function ClassDirectiveHandlerCompact(){
    AddDirectiveHandler(ClassDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(ClassDirectiveExpansionRule);
}
