import { Stack } from "../stack";
import { IContext } from "../types/context";

export class Context implements IContext{
    private record_: Record<string, Stack<any>> = {};
    
    public Push(key: string, value: any){
        (this.record_[key] = (this.record_[key] || new Stack<any>())).Push(value);
    }

    public Pop(key: string, noResult?: any){
        return ((key in this.record_) ? this.record_[key].Pop() : (noResult || null));
    }

    public Peek(key: string, noResult?: any){
        return ((key in this.record_) ? this.record_[key].Peek() : (noResult || null));
    }

    public Get(key: string){
        return ((key in this.record_) ? this.record_[key] : null);
    }
}
