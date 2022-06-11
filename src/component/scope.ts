import { RootProxy } from "../proxy/root";
import { IScope } from "../types/scope";

export class Scope implements IScope{
    private name_ = '';
    private proxy_: RootProxy;
    
    public constructor(private componentId_: string, private id_: string, private root_: HTMLElement){
        this.proxy_ = new RootProxy(this.id_, {});
    }
    
    public GetComponentId(){
        return this.componentId_;
    }

    public GetId(){
        return this.id_;
    }

    public SetName(name: string){
        this.name_ = name;
    }

    public GetName(){
        return this.name_;
    }

    public GetRoot(){
        return this.root_;
    }

    public GetProxy(){
        return this.proxy_;
    }

    public FindElement(deepestElement: HTMLElement, predicate: (element?: HTMLElement) => boolean): HTMLElement | null{
        if (deepestElement === this.root_ || !this.root_.contains(deepestElement)){
            return null;
        }

        do{
            deepestElement = <HTMLElement>deepestElement.parentElement;
            try{
                if (predicate(deepestElement)){
                    return deepestElement;
                }
            }
            catch {}
        } while (deepestElement !== this.root_);

        return null;
    }

    public FindAncestor(target: HTMLElement, index?: number): HTMLElement | null{
        let realIndex = (index || 0);
        return this.FindElement(target, () => (realIndex-- == 0));
    }
}
