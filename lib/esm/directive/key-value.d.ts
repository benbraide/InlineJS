export interface IKeyValueParams {
    componentId: string;
    contextElement: HTMLElement;
    key: string;
    expression: string;
    callback: (info: [string, any]) => void;
    arrayCallback?: (list: Array<any>) => void;
    useEffect?: boolean;
}
export declare function ResolveKeyValue({ componentId, contextElement, key, expression, callback, arrayCallback, useEffect }: IKeyValueParams): void;
