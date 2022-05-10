import { AnimationEaseCallbackType, IAnimationEase, IAnimationEaseCollection, IAnimationEaseParams } from "../../types/animation";

export class AnimationEaseCollection implements IAnimationEaseCollection{
    private handlers_: Record<string, IAnimationEase | AnimationEaseCallbackType> = {};
    
    public Add(handler: IAnimationEase | AnimationEaseCallbackType, name?: string){
        if (typeof handler !== 'function'){
            this.handlers_[handler.GetName()] = handler;
        }
        else if (name){
            this.handlers_[name] = handler;
        }
    }

    public Remove(name: string){
        delete this.handlers_[name];
    }

    public Find(name: string): AnimationEaseCallbackType | null{
        if (this.handlers_.hasOwnProperty(name)){
            let handler = this.handlers_[name];
            return ((typeof handler === 'function') ? handler : (params: IAnimationEaseParams) => (handler as IAnimationEase).Handle(params));
        }
        return null;
    }
}
