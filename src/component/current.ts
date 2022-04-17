import { GetGlobal } from "../global/get";

export function PushCurrentComponent(componentId: string){
    GetGlobal().PushCurrentComponent(componentId);
}

export function PopCurrentComponent(){
    return GetGlobal().PopCurrentComponent();
}

export function PeekCurrentComponent(){
    return GetGlobal().PeekCurrentComponent();
}
