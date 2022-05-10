import { AnimationActorCallbackType, IAnimationActor, IAnimationActorCollection, IAnimationActorParams } from "../../types/animation";

export class AnimationActorCollection implements IAnimationActorCollection{
    private handlers_: Record<string, IAnimationActor | AnimationActorCallbackType> = {};
    
    public Add(handler: IAnimationActor | AnimationActorCallbackType, name?: string){
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

    public Find(name: string): AnimationActorCallbackType | null{
        if (this.handlers_.hasOwnProperty(name)){
            let handler = this.handlers_[name];
            return ((typeof handler === 'function') ? handler : (params: IAnimationActorParams) => (handler as IAnimationActor).Handle(params));
        }
        return null;
    }
}
