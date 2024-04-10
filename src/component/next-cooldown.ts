import { IChanges } from "../types/changes";
import { FindComponentById } from "./find";
import { StoreProxyHandler } from "./set-proxy-access-handler";

export class NextCooldown{
    protected queued_ = false;
    protected setCallback_: (() => void) | null = null;
    
    public constructor(protected componentId_: string, protected callback_?: () => void, protected initialized_ = false){}

    public Queue(callback?: () => void){
        const evaluate = () => ((this.setCallback_ || callback || this.callback_)?.()), storedProxyHandler = StoreProxyHandler(this.componentId_);
        if (!this.queued_ && this.initialized_){
            this.queued_ = true;
            this.ListenNext_(FindComponentById(this.componentId_)?.GetBackend().changes, () => storedProxyHandler(() => {
                this.queued_ = false;
                evaluate();
            }));
        }
        else if (!this.initialized_){//Initialize
            this.initialized_ = true;
            evaluate();
        }
        else{
            this.setCallback_ = (callback || null);
        }
    }

    protected ListenNext_(changes: IChanges | undefined, callback: () => void){}
}
