import { IComponent } from "../types/component";
import { FindComponentById } from "./find";

export function PushCurrentScope(component: IComponent | string, scope: string){
    ((typeof component === 'string') ? FindComponentById(component) : component)?.PushCurrentScope(scope);
}

export function PopCurrentScope(component: IComponent | string){
    return (((typeof component === 'string') ? FindComponentById(component) : component)?.PopCurrentScope() || null);
}

export function PeekCurrentScope(component: IComponent | string){
    return (((typeof component === 'string') ? FindComponentById(component) : component)?.PeekCurrentScope() || null);
}
