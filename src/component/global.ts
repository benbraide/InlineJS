import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";

const InlineJSGlobalComponentKey = '__InlineJS_GLOBAL_COMPONENT_KEY__';

export function QueryGlobalComponent(create?: boolean): IComponent{
    const info = globalThis[InlineJSGlobalComponentKey];
    if (info || create === false){
        return info.component;
    }

    const root = document.createElement('template');
    globalThis[InlineJSGlobalComponentKey] = { root,
        component: GetGlobal().CreateComponent(root),
    };

    return globalThis[InlineJSGlobalComponentKey];
}
