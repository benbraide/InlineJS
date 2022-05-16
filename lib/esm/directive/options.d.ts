interface IResolveOptionsDetail<T> {
    options?: T;
    list?: Array<string>;
    option?: string;
    index?: number;
}
interface IResolveOptionsParams<T> {
    options: T;
    list: Array<string>;
    defaultNumber?: number | ((option: string) => number);
    callback?: (details: IResolveOptionsDetail<T>) => void | boolean;
    unknownCallback?: (details: IResolveOptionsDetail<T>) => void;
}
export declare function ExtractDuration(value: string, defaultValue?: number): number;
export declare function ResolveOptions<T>({ options, list, defaultNumber, callback, unknownCallback }: IResolveOptionsParams<T>): T;
export {};
