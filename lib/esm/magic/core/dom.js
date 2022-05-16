import { FindComponentById } from "../../component/find";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
const props = {
    root: ({ componentId }) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetRoot(); },
    form: ({ componentId, contextElement }) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElement(contextElement, el => (el instanceof HTMLElement)); },
    ancestor: ({ componentId, contextElement }) => (index) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindAncestor(contextElement, (index || 0)); },
    parent: ({ componentId, contextElement }) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindAncestor(contextElement, 0); },
};
let proxy = null;
export const DomMagicHandler = CreateMagicHandlerCallback('dom', (params) => {
    return (proxy || (proxy = CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && props.hasOwnProperty(prop)) {
                return props[prop](params);
            }
        },
        lookup: Object.keys(props),
    }))));
});
export function DomMagicHandlerCompact() {
    AddMagicHandler(DomMagicHandler);
}
