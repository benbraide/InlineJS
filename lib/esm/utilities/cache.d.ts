export declare function InitCache<T = any>(key: string, value: T | (() => T)): T;
export declare function GetCache<T = any>(key: string, defaultValue: T | (() => T)): T;
export declare function SetCacheValue<T = any>(cacheKey: string, key: string, value: any, defaultValue: T | (() => T)): void;
export declare function FindCacheValue<T = any>(cacheKey: string, key: string): T | undefined;
export declare function UseCache<T = any, U = any>(callback: () => T | false, cacheKey: string, defaultValue: T | (() => T), hitTest: (cache: T) => boolean, onHit: (cache: T) => U, onMiss: () => U): U;
export declare function InvalidateCache(cacheKey: string): void;
