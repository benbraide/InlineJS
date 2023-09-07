export declare function FindAncestor<T = HTMLElement>(target: HTMLElement, predicate: (element: HTMLElement) => boolean): T | null;
export declare function FindAncestorByClass<T = HTMLElement>(target: HTMLElement, className: string): T | null;
export declare function FindAncestorByAttribute<T = HTMLElement>(target: HTMLElement, attributeName: string): T | null;
export declare function FindAncestorByAttributeValue<T = HTMLElement>(target: HTMLElement, attributeName: string, value: string): T | null;
export declare function FindAncestorByTagName<T = HTMLElement>(target: HTMLElement, tagName: string): T | null;
