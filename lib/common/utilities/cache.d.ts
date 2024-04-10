export declare function InitCache<T = any>(key: string, value: T | (() => T)): T;
export declare function GetCache<T = any>(key: string, defaultValue: T | (() => T)): T;
export declare function SetCacheValue<T = any>(cacheKey: string, key: string, value: any, defaultValue: T | (() => T)): void;
export declare function FindCacheValue<T = any>(cacheKey: string, key: string): T | undefined;
export declare function UseCache<T = any, U = any>(callback: () => T, cacheKey: string, value: any, defaultValue: T | (() => T), getter?: (cache: T) => [any, U]): U;
