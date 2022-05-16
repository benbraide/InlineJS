"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMagicHandlerCompact = exports.GetMagicHandler = void 0;
const find_1 = require("../../component/find");
const get_1 = require("../../global/get");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
let FectCheckpoints = new Array();
function GetFetchCheckpoint(contextElement) {
    let found = FectCheckpoints.find(details => (details.contextElement === contextElement));
    return (found ? found.checkpoint : -1);
}
function ComputeNextFetchCheckpoint(component, contextElement) {
    var _a;
    let found = FectCheckpoints.find(details => (details.contextElement === contextElement));
    if (found) {
        return ++found.checkpoint;
    }
    let checkpoint = 0;
    FectCheckpoints.push({ contextElement, checkpoint });
    (_a = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.AddUninitCallback(() => {
        FectCheckpoints.splice(FectCheckpoints.findIndex(details => (details.contextElement === contextElement)), 1);
    });
    return checkpoint;
}
exports.GetMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('get', ({ componentId, component, contextElement }) => {
    let checkpoint = ComputeNextFetchCheckpoint((component || (0, find_1.FindComponentById)(componentId)), contextElement);
    return (path, json) => {
        if (checkpoint != GetFetchCheckpoint(contextElement)) {
            return Promise.reject();
        }
        if (path === null) { //No request
            return null;
        }
        return new Promise((resolve, reject) => {
            (0, get_1.GetGlobal)().GetFetchConcept().Get(path, {
                method: 'GET',
                credentials: 'same-origin',
            }).then(response => (json ? response.json() : response.text())).then((response) => {
                if (checkpoint == GetFetchCheckpoint(contextElement)) {
                    resolve(response);
                }
            }).catch(reject);
        });
    };
});
function GetMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.GetMagicHandler);
}
exports.GetMagicHandlerCompact = GetMagicHandlerCompact;
