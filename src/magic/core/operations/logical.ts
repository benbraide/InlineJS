import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { CreateReadonlyProxy } from "../../../proxy/create";

const methods = {
    or: (...values: any[]) => values.at(values.findIndex(value => !!value)),
    and: (...values: any[]) => values.at(values.findIndex(value => !value)),
};

let proxy: object | null = null;

export const LogicalMagicHandler = CreateMagicHandlerCallback('log', () => (proxy || (proxy = CreateReadonlyProxy(methods))));

export function LogicalMagicHandlerCompact(){
    AddMagicHandler(LogicalMagicHandler);
}
