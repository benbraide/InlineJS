import { FindComponentById } from "../../component/find";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
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
export const GetMagicHandler = CreateMagicHandlerCallback('get', ({ componentId, component, contextElement }) => {
    let checkpoint = ComputeNextFetchCheckpoint((component || FindComponentById(componentId)), contextElement);
    return (path, json) => {
        if (checkpoint != GetFetchCheckpoint(contextElement)) {
            return Promise.reject();
        }
        if (path === null) { //No request
            return null;
        }
        return new Promise((resolve, reject) => {
            GetGlobal().GetFetchConcept().Get(path, {
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
export function GetMagicHandlerCompact() {
    AddMagicHandler(GetMagicHandler);
}
