import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { CreateReadonlyProxy } from "../../../proxy/create";
const methods = {
    comp: (first, second) => ((first < second) ? -1 : ((first == second) ? 0 : 1)),
    lt: (first, second) => (first < second),
    le: (first, second) => (first <= second),
    eq: (first, second) => (first == second),
    eqs: (first, second) => (first === second),
    nes: (first, second) => (first !== second),
    ne: (first, second) => (first != second),
    ge: (first, second) => (first >= second),
    gt: (first, second) => (first > second),
};
let proxy = null;
export const RelationalMagicHandler = CreateMagicHandlerCallback('rel', () => (proxy || (proxy = CreateReadonlyProxy(methods))));
export function RelationalMagicHandlerCompact() {
    AddMagicHandler(RelationalMagicHandler);
}
