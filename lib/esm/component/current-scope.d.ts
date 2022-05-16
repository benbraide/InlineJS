import { IComponent } from "../types/component";
export declare function PushCurrentScope(component: IComponent | string, scope: string): void;
export declare function PopCurrentScope(component: IComponent | string): string | null;
export declare function PeekCurrentScope(component: IComponent | string): string | null;
