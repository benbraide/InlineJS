import { IStack } from "./stack";
export interface IContext {
    Push(key: string, value: any): void;
    Pop(key: string, noResult?: any): any;
    Peek(key: string, noResult?: any): any;
    Get(key: string): IStack<any> | null;
    GetHistory(key: string): Array<any>;
    GetRecordKeys(): Array<string>;
}
