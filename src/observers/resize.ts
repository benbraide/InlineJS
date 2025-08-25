import { JournalTry } from "../journal/try";
import { IResizeObserver, ResizeObserverHandlerType } from "../types/resize-observer";

interface IResizeObserverHandlerInfo{
    target: Element;
    handler: ResizeObserverHandlerType;
}

export class ResizeObserver implements IResizeObserver{
    private observer_: globalThis.ResizeObserver | null = null;
    private handlers_ = new Array<IResizeObserverHandlerInfo>();
    
    public constructor(){
        if (globalThis.MutationObserver){
            try{
                this.observer_ = new globalThis.ResizeObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        this.handlers_.filter(({ target }) => (target === entry.target)).forEach((info) => {
                            JournalTry(() => info.handler({ entry, observer }), 'InlineJS.ResizeObserver');
                        });
                    });
                });
            }
            catch{
                this.observer_ = null;
            }
        }
    }

    public GetNative(){
        return this.observer_;
    }

    public Observe(target: Element, handler: ResizeObserverHandlerType, options?: ResizeObserverOptions){
        this.handlers_.push({ target, handler });
        this.observer_?.observe(target, (options || { box: 'border-box' }));
    }

    public Unobserve(target: Element){
        this.handlers_ = this.handlers_.filter(info => (info.target === target));
        this.observer_?.unobserve(target);
    }

    public Destroy(){
        this.handlers_ = [];
        this.observer_?.disconnect();
        this.observer_ = null;
    }
}
