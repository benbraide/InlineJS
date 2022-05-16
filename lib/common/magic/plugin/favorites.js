"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesMagicHandlerCompact = exports.FavoritesMagicHandler = void 0;
const get_1 = require("../../global/get");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
const collection_1 = require("./collection");
const FavoritesCollectionConceptName = 'favorites';
function CreateFavoritesProxy() {
    let methods = (0, collection_1.BuildCollectionMethods)(FavoritesCollectionConceptName);
    const getCollectionConcept = () => (0, get_1.GetGlobal)().GetConcept(FavoritesCollectionConceptName);
    return (0, create_1.CreateInplaceProxy)((0, create_1.BuildGetterProxyOptions)({
        getter: (prop) => {
            var _a, _b, _c;
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
        },
        lookup: [...Object.keys(methods), 'keyed', 'items', 'count'],
    }));
}
const FavoritesProxy = CreateFavoritesProxy();
exports.FavoritesMagicHandler = (0, callback_1.CreateMagicHandlerCallback)(FavoritesCollectionConceptName, () => FavoritesProxy);
function FavoritesMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.FavoritesMagicHandler);
}
exports.FavoritesMagicHandlerCompact = FavoritesMagicHandlerCompact;
