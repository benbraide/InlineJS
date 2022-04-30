import { FindComponentById } from "../../component/find";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { IComponent } from "../../types/component";

interface IFetchCheckpointDetails{
    contextElement: HTMLElement,
    checkpoint: number;
}

let FectCheckpoints = new Array<IFetchCheckpointDetails>();

function GetFetchCheckpoint(contextElement: HTMLElement){
    let found = FectCheckpoints.find(details => (details.contextElement === contextElement));
    return (found ? found.checkpoint : -1);
}

function ComputeNextFetchCheckpoint(component: IComponent | null, contextElement: HTMLElement){
    let found = FectCheckpoints.find(details => (details.contextElement === contextElement));
    if (found){
        return ++found.checkpoint;
    }

    let checkpoint = 0;
    FectCheckpoints.push({ contextElement, checkpoint });
    component?.FindElementScope(contextElement)?.AddUninitCallback(() => {//Remove entry
        FectCheckpoints.splice(FectCheckpoints.findIndex(details => (details.contextElement === contextElement)), 1);
    });

    return checkpoint;
}

export const FetchMagicHandler = CreateMagicHandlerCallback('fetch', ({ componentId, component, contextElement }) => {
    let checkpoint = ComputeNextFetchCheckpoint((component || FindComponentById(componentId)), contextElement);
    return (path: string | null, json?: boolean) => {
        if (checkpoint != GetFetchCheckpoint(contextElement)){
            return Promise.reject();
        }

        if (path === null){//No request
            return null;
        }

        return new Promise((resolve, reject) => {
            fetch(path, {
                method: 'GET',
                credentials: 'same-origin',
            }).then(response => (json ? response.json() : response.text())).then((response) => {
                if (checkpoint == GetFetchCheckpoint(contextElement)){
                    resolve(response);
                }
            }).catch(reject);
        });
    };
});

export function FetchMagicHandlerCompact(){
    AddMagicHandler(FetchMagicHandler);
}
