export interface IStack<T>{
    Push(value: T): void;
    Purge(): Array<T>;
    Pop(): T | null;
    Peek(): T | null;
    IsEmpty(): boolean;
    GetHistory(): Array<T>;
}
