import { Stack } from "../stack";
import { IContext } from "../types/context";

export class Context implements IContext{
    private record_: Record<string, Stack<any>> = {};
    
    public Push(key: string, value: any){
        (this.record_[key] = (this.record_[key] || new Stack<any>())).Push(value);
    }

    public Pop(key: string, noResult?: any){
        return (this.record_.hasOwnProperty(key) ? this.record_[key].Pop() : (noResult || null));
    }

    public Peek(key: string, noResult?: any){
        return (this.record_.hasOwnProperty(key) ? this.record_[key].Peek() : (noResult || null));
    }

    public Get(key: string){
        return (this.record_.hasOwnProperty(key) ? this.record_[key] : null);
    }

    public GetHistory(key: string){
        return (this.record_.hasOwnProperty(key) ? this.record_[key].GetHistory() : []);
    }

    public GetRecordKeys(){
        return Object.keys(this.record_);
    }
}
