import { GetGlobal } from "../global/get";
const InlineJSGlobalComponentKey = '__InlineJS_GLOBAL_COMPONENT_KEY__';
export function QueryGlobalComponent(create) {
    const info = globalThis[InlineJSGlobalComponentKey];
    if (info || create === false) {
        return info.component;
    }
    const root = document.createElement('template');
    globalThis[InlineJSGlobalComponentKey] = { root,
        component: GetGlobal().CreateComponent(root),
    };
    return globalThis[InlineJSGlobalComponentKey];
}
