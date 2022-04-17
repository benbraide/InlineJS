import { IStack } from './types/stack'

export class Stack<T> implements IStack<T>{
    private list_: Array<T> = new Array<T>();

    public constructor(duplicate?: Stack<T>){
        if (duplicate){
            this.list_ = duplicate.list_.map(item => item);
        }
    }

    public Push(value: T): void{
        this.list_.push(value);
    }

    public Pop(): T | null{
        return ((this.list_.length == 0) ? null : (this.list_.pop() as T));
    }

    public Peek(): T | null{
        return ((this.list_.length == 0) ? null : this.list_[this.list_.length - 1]);
    }

    public IsEmpty(): boolean{
        return (this.list_.length == 0);
    }
}
