import { Stack } from "./stack";
import { IContext } from "./types/context";
import { IStack } from "./types/stack";

export class Context implements IContext{
    private stacks_: Record<string, Stack<any>> = {};

    public Push(key: string, value: any){
        (this.stacks_[key] = (this.stacks_[key] || new Stack<any>())).Push(value);
    }

    public Pop(key: string, noResult = null){
        return ((key in this.stacks_ && this.stacks_[key].IsEmpty()) ? this.stacks_[key].Pop() : noResult);
    }

    public Peek(key: string, noResult = null){
        return ((key in this.stacks_ && this.stacks_[key].IsEmpty()) ? this.stacks_[key].Peek() : noResult);
    }

    public Get(key: string): IStack<any> | null{
        return ((key in this.stacks_) ? new Stack(this.stacks_[key]) : null);
    }
}
