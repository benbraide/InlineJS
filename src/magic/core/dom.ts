import { FindComponentById } from "../../component/find";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { IMagicHandlerParams } from "../../types/magics";

const props = {
    root: ({ componentId }: IMagicHandlerParams) => FindComponentById(componentId)?.GetRoot(),
    form: ({ componentId, contextElement }: IMagicHandlerParams) => FindComponentById(componentId)?.FindElement(contextElement, el => (el instanceof HTMLElement)),
    ancestor: ({ componentId, contextElement }: IMagicHandlerParams) => (index?: number) => FindComponentById(componentId)?.FindAncestor(contextElement, (index || 0)),
    parent: ({ componentId, contextElement }: IMagicHandlerParams) => FindComponentById(componentId)?.FindAncestor(contextElement, 0),
};

let proxy: object | null = null;

export const DomMagicHandler = CreateMagicHandlerCallback('dom', (params) => {
    return (proxy || (proxy = CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && props.hasOwnProperty(prop)){
                return props[prop](params);
            }
        },
        lookup: Object.keys(props),
    }))));
});

export function DomMagicHandlerCompact(){
    AddMagicHandler(DomMagicHandler);
}
