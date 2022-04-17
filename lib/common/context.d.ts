import { IContext } from "./types/context";
import { IStack } from "./types/stack";
export declare class Context implements IContext {
    private stacks_;
    Push(key: string, value: any): void;
    Pop(key: string, noResult?: null): any;
    Peek(key: string, noResult?: null): any;
    Get(key: string): IStack<any> | null;
}
