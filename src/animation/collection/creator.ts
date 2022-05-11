import { AnimationCreatorCallbackType, IAnimationCreatorCollection } from "../../types/animation";

export class AnimationCreatorCollection implements IAnimationCreatorCollection{
    private list_: Record<string, AnimationCreatorCallbackType> = {};
    
    public Add(name: string, creator: AnimationCreatorCallbackType){
        this.list_[name] = creator;
    }

    public Remove(name: string){
        delete this.list_[name];
    }

    public Find(name: string): AnimationCreatorCallbackType | null{
        return (this.list_.hasOwnProperty(name) ? this.list_[name] : null);
    }
}
