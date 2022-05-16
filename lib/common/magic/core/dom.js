"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomMagicHandlerCompact = exports.DomMagicHandler = void 0;
const find_1 = require("../../component/find");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
const props = {
    root: ({ componentId }) => { var _a; return (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetRoot(); },
    form: ({ componentId, contextElement }) => { var _a; return (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElement(contextElement, el => (el instanceof HTMLElement)); },
    ancestor: ({ componentId, contextElement }) => (index) => { var _a; return (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindAncestor(contextElement, (index || 0)); },
    parent: ({ componentId, contextElement }) => { var _a; return (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindAncestor(contextElement, 0); },
};
let proxy = null;
exports.DomMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('dom', (params) => {
    return (proxy || (proxy = (0, create_1.CreateInplaceProxy)((0, create_1.BuildGetterProxyOptions)({
        getter: (prop) => {
            if (prop && props.hasOwnProperty(prop)) {
                return props[prop](params);
            }
        },
        lookup: Object.keys(props),
    }))));
});
function DomMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.DomMagicHandler);
}
exports.DomMagicHandlerCompact = DomMagicHandlerCompact;
