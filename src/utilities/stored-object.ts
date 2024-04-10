import { GetGlobal } from "../global/get";
import { IObjectRetrievalParams } from "../types/global";

export function RetrieveStoredObject({ key, ...rest }: IObjectRetrievalParams){
    const found = GetGlobal().RetrieveObject({ key, ...rest });
    return (GetGlobal().IsNothing(found) ? key : found);
}

export function PeekStoredObject({ key, ...rest }: IObjectRetrievalParams){
    const found = GetGlobal().PeekObject({ key, ...rest });
    return (GetGlobal().IsNothing(found) ? key : found);
}
