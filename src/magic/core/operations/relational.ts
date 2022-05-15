import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";
import { CreateReadonlyProxy } from "../../../proxy/create";

const methods = {
    comp: (first: any, second: any) => ((first < second) ? -1 : ((first == second) ? 0 : 1)),
    lt: (first: any, second: any) => (first < second),
    le: (first: any, second: any) => (first <= second),
    eq: (first: any, second: any) => (first == second),
    eqs: (first: any, second: any) => (first === second),
    nes: (first: any, second: any) => (first !== second),
    ne: (first: any, second: any) => (first != second),
    ge: (first: any, second: any) => (first >= second),
    gt: (first: any, second: any) => (first > second),
};

let proxy: object | null = null;

export const RelationalMagicHandler = CreateMagicHandlerCallback('rel', () => (proxy || (proxy = CreateReadonlyProxy(methods))));

export function RelationalMagicHandlerCompact(){
    AddMagicHandler(RelationalMagicHandler);
}
