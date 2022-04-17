export declare function AddOutsideEventListener(target: HTMLElement, events: string | Array<string>, handler: (event?: Event) => void): void;
export declare function RemoveOutsideEventListener(target: HTMLElement, events: string | Array<string>, handler: (event?: Event) => void): void;
export declare function AddOutsideEventExcept(target: HTMLElement, list: Record<string, Array<HTMLElement> | HTMLElement>, handler?: (event?: Event) => void): void;
export declare function UnbindOutsideEvent(target: HTMLElement): void;
