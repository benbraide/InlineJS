import { IComponent } from "../types/component";
export declare function FindComponentById(id: string): IComponent | null;
export declare function FindComponentByName(name: string): IComponent | null;
export declare function FindComponentByRoot(root: HTMLElement | null): IComponent | null;
export declare function FindComponentByCallback(callback: (component: IComponent) => boolean): IComponent | null;
