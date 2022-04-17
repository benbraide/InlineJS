export interface IStack<T> {
    Push(value: T): void;
    Pop(): T | null;
    Peek(): T | null;
    IsEmpty(): boolean;
}
