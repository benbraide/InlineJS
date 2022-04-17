interface IResolveOptionsDetail<T> {
    options?: T;
    list?: Array<string>;
    option?: string;
    index?: number;
}
export declare function ExtractDuration(value: string, defaultValue?: number): number;
export declare function ResolveOptions<T>(options: T, list: Array<string>, defaultNumber?: number, callback?: (details?: IResolveOptionsDetail<T>) => void | boolean): T;
export {};
