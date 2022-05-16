import { GetGlobal } from "../global/get";
export function PushCurrentComponent(componentId) {
    GetGlobal().PushCurrentComponent(componentId);
}
export function PopCurrentComponent() {
    return GetGlobal().PopCurrentComponent();
}
export function PeekCurrentComponent() {
    return GetGlobal().PeekCurrentComponent();
}
