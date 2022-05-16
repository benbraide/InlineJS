import { IStack } from './types/stack';
export declare class Stack<T> implements IStack<T> {
    private list_;
    constructor(duplicate?: Stack<T>);
    Push(value: T): void;
    Pop(): T | null;
    Peek(): T | null;
    IsEmpty(): boolean;
}
