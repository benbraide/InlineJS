import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { CreateReadonlyProxy } from "../../../proxy/create";
const methods = {
    or: (...values) => values.at(values.findIndex(value => !!value)),
    and: (...values) => values.at(values.findIndex(value => !value)),
};
let proxy = null;
export const LogicalMagicHandler = CreateMagicHandlerCallback('log', () => (proxy || (proxy = CreateReadonlyProxy(methods))));
export function LogicalMagicHandlerCompact() {
    AddMagicHandler(LogicalMagicHandler);
}
