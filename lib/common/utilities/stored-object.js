"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeekStoredObject = exports.RetrieveStoredObject = void 0;
const get_1 = require("../global/get");
function RetrieveStoredObject(_a) {
    var { key } = _a, rest = __rest(_a, ["key"]);
    let found = (0, get_1.GetGlobal)().RetrieveObject(Object.assign({ key }, rest));
    return ((0, get_1.GetGlobal)().IsNothing(found) ? key : found);
}
exports.RetrieveStoredObject = RetrieveStoredObject;
function PeekStoredObject(_a) {
    var { key } = _a, rest = __rest(_a, ["key"]);
    let found = (0, get_1.GetGlobal)().PeekObject(Object.assign({ key }, rest));
    return ((0, get_1.GetGlobal)().IsNothing(found) ? key : found);
}
exports.PeekStoredObject = PeekStoredObject;
