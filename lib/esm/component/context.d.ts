import { Stack } from "../stack";
import { IContext } from "../types/context";
export declare class Context implements IContext {
    private record_;
    Push(key: string, value: any): void;
    Pop(key: string, noResult?: any): any;
    Peek(key: string, noResult?: any): any;
    Get(key: string): Stack<any> | null;
    GetHistory(key: string): any[];
    GetRecordKeys(): string[];
}
