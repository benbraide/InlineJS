import { JournalTry } from "../../journal/try";
import { IIntersectionObserver, IntersectionObserverHandlerType } from "../../types/intersection";
import { BuildIntersectionOptions } from "./options";

interface IIntersectionObserverHandlerInfo{
    target: Element;
    handler: IntersectionObserverHandlerType;
}

export class IntersectionObserver implements IIntersectionObserver{
    private observer_: globalThis.IntersectionObserver | null = null;
    private handlers_ = new Array<IIntersectionObserverHandlerInfo>();
    
    public constructor(private id_: string, options: IntersectionObserverInit){
        let id = this.id_;
        this.observer_ = new globalThis.IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                this.handlers_.filter(({ target }) => (target === entry.target)).forEach((info) => {
                    JournalTry(() => info.handler({ entry, id, observer }), 'InlineJS.IntersectionObserver');
                });
            });
        }, BuildIntersectionOptions(options));
    }
    
    public GetId(){
        return this.id_;
    }

    public GetNative(){
        return this.observer_;
    }

    public Observe(target: Element, handler: IntersectionObserverHandlerType){
        this.handlers_.push({ target, handler });
        this.observer_?.observe(target);
    }

    public Unobserve(target: Element){
        this.handlers_ = this.handlers_.filter(info => (info.target === target));
        this.observer_?.unobserve(target);
    }
}
