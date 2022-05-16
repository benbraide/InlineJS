import { IComponent } from "../types/component";
export declare function InitComponentCache(): {
    id: string;
    component: IComponent | null;
};
export declare function FindComponentById(id: string): IComponent | null;
export declare function FindComponentByName(name: string): IComponent | null;
export declare function FindComponentByRoot(root: HTMLElement): IComponent | null;
