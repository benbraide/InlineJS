export declare function InitCache<T = any>(key: string, value: T): T;
export declare function GetCache<T = any>(key: string, defaultValue: T): T;
export declare function SetCacheValue(cacheKey: string, key: string, value: any, defaultValue: any): void;
export declare function FindCacheValue<T = any>(cacheKey: string, key: string): T | undefined;
