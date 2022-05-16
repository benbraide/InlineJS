"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartMagicHandlerCompact = exports.CartMagicHandler = void 0;
const get_1 = require("../../global/get");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
const collection_1 = require("./collection");
const CartCollectionConceptName = 'cart';
function CreateCartProxy() {
    const getCollectionConcept = () => (0, get_1.GetGlobal)().GetConcept(CartCollectionConceptName);
    let methods = Object.assign(Object.assign({}, (0, collection_1.BuildCollectionMethods)(CartCollectionConceptName)), { addOffset: (key, handler, initValue) => {
            var _a;
            (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.AddOffset(key, handler, initValue);
        }, removeOffset: (key) => {
            var _a;
            (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.RemoveOffset(key);
        }, getOffset: (key) => {
            var _a;
            return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetOffset(key);
        } });
    return (0, create_1.CreateInplaceProxy)((0, create_1.BuildGetterProxyOptions)({
        getter: (prop) => {
            var _a, _b, _c, _d;
            if (prop && methods.hasOwnProperty(prop)) {
                return methods[prop];
            }
            if (prop === 'keyed') {
                return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetKeyedProxy();
            }
            if (prop === 'items') {
                return (_b = getCollectionConcept()) === null || _b === void 0 ? void 0 : _b.GetItemProxies();
            }
            if (prop === 'count') {
                return (_c = getCollectionConcept()) === null || _c === void 0 ? void 0 : _c.GetCount();
            }
            if (prop) {
                return (_d = getCollectionConcept()) === null || _d === void 0 ? void 0 : _d.GetOffset(prop);
            }
        },
        lookup: [...Object.keys(methods), 'keyed', 'items', 'count', 'subTotal', 'total'],
    }));
}
const CartProxy = CreateCartProxy();
exports.CartMagicHandler = (0, callback_1.CreateMagicHandlerCallback)(CartCollectionConceptName, () => CartProxy);
function CartMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.CartMagicHandler);
}
exports.CartMagicHandlerCompact = CartMagicHandlerCompact;
