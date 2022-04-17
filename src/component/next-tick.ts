import { FindComponentById } from "./find";

export class NextTick{
    private queued_ = false;
    private setCallback_: (() => void) | null = null;
    
    public constructor(private componentId_: string, private callback_?: () => void, private initialized_ = false){}

    public Queue(callback?: () => void){
        let evaluate = () => ((this.setCallback_ || callback || this.callback_) && (this.setCallback_ || callback || this.callback_)!());
        if (!this.queued_ && this.initialized_){
            this.queued_ = true;
            FindComponentById(this.componentId_)?.GetBackend().changes.AddNextTickHandler(() => {
                this.queued_ = false;
                evaluate();
            });
        }
        else if (!this.initialized_){//Initialize
            this.initialized_ = true;
            evaluate();
        }
        else{
            this.setCallback_ = (callback || null);
        }
    }
}
