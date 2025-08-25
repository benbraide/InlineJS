import { IContext } from "../types/context";
import { IStack } from "../types/stack";
export declare class Context implements IContext {
    private record_;
    Push(key: string, value: any): void;
    Purge(): Record<string, IStack<any>>;
    Pop(key: string, noResult?: any): any;
    Peek(key: string, noResult?: any): any;
    Get(key: string): IStack<any> | null;
    GetHistory(key: string): any[];
    GetRecordKeys(): string[];
}
