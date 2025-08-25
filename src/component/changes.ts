import { JournalTry } from "../journal/try";
import { Stack } from "../stack";
import { ChangeCallbackType, IBubbledChange, IChange } from "../types/change";
import { IChanges } from "../types/changes";
import { DeepCopy } from "../utilities/deep-copy";
import { ChangesMonitor } from "./changes-monitor";
import { FindComponentById } from "./find";

export class Changes extends ChangesMonitor implements IChanges{
    private nextTickHandlers_ = new Array<() => void>();// Gets notified at the end of a schedule run
    private nextIdleHandlers_ = new Array<() => void>();// Gets notified when a scheduke runs without any changes
    private nextNonIdleHandlers_ = new Array<() => void>();// Gets notified when a schedule runs with changes

    private isScheduled_ = false;
    private isIdle_ = true;
    private isDestroyed_ = false;

    private list_ = new Array<IChange | IBubbledChange>();
    private subscribers_: Record<string, Record<string, ChangeCallbackType>> = {};
    private subscriberPaths_: Record<string, string> = {};

    private origins_ = new Stack<ChangeCallbackType>();
    
    public constructor(private componentId_: string){
        super();
    }
    
    public GetComponentId(){
        return this.componentId_;
    }
    
    public AddNextTickHandler(handler: () => void){
        this.nextTickHandlers_.push(handler);
        this.Schedule();
        this.NotifyListeners_('next-tick-handlers', this.nextTickHandlers_);
    }

    public AddNextIdleHandler(handler: () => void){
        this.nextIdleHandlers_.push(handler);
        this.Schedule();
        this.NotifyListeners_('next-idle-handlers', this.nextIdleHandlers_);
    }

    public AddNextNonIdleHandler(handler: () => void){
        this.nextNonIdleHandlers_.push(handler);
        this.Schedule();
        this.NotifyListeners_('next-non-idle-handlers', this.nextNonIdleHandlers_);
    }

    public Schedule(){
        if (this.isDestroyed_ || this.isScheduled_){
            return;
        }

        this.isScheduled_ = true;
        queueMicrotask(() => {//Defer dispatches
            this.isScheduled_ = false;
            const batches = new Map<ChangeCallbackType, Array<IChange | IBubbledChange>>();
            const addBatch = (change: IChange | IBubbledChange, callback: ChangeCallbackType) => {
                if (!batches.has(callback)){
                    batches.set(callback, [change]);
                }
                else{//Add to existing batch
                    batches.get(callback)!.push(change);
                }
            };

            const getOrigin = (change: IChange | IBubbledChange) => (('original' in change) ? change.original.origin : change.origin);
            if (this.list_.length != 0){
                const pendingChanges = this.list_.splice(0);
                pendingChanges.forEach((change) => {
                    const origin = getOrigin(change);
                    Object.keys(this.subscribers_).forEach((path) => {
                        if (path === change.path || path.startsWith(`${change.path}.`)){
                            Object.values(this.subscribers_[path]).filter(callback => (callback !== origin)).forEach(callback => addBatch(change, callback));
                        }
                    });
                });
                this.NotifyListeners_('list', this.list_);
            }

            if (batches.size == 0) {// Idle
                if (!this.isIdle_) {
                    this.isIdle_ = true;
                }

                if (this.nextIdleHandlers_.length != 0) { //Always check for idle handlers if there are no batches
                    this.nextIdleHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextIdle`));
                    this.NotifyListeners_('next-idle-handlers', this.nextIdleHandlers_);
                }
                
                if (this.nextTickHandlers_.length != 0){
                    this.nextTickHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextTick`));
                    this.NotifyListeners_('next-tick-handlers', this.nextTickHandlers_);
                }

                return;
            }

            if (this.isIdle_) { // Out of idle
                this.isIdle_ = false;
            }

            batches.forEach((changes, callback) => JournalTry(() => callback(changes), `InlineJs.Region<${this.componentId_}>.Schedule`));
            
            if (this.nextNonIdleHandlers_.length != 0) { //Always check for non-idle handlers if there are batches
                this.nextNonIdleHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextNonIdle`));
                this.NotifyListeners_('next-non-idle-handlers', this.nextNonIdleHandlers_);
            }

            if (this.nextTickHandlers_.length != 0){
                this.nextTickHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextTick`));
                this.NotifyListeners_('next-tick-handlers', this.nextTickHandlers_);
            }

            this.NotifyListeners_('scheduled', this.isScheduled_);
            this.Schedule();// Defer idle check
        });

        this.NotifyListeners_('scheduled', this.isScheduled_);
    }
    
    public Add(change: IChange | IBubbledChange){
        this.list_.push(change);
        this.Schedule();
        this.NotifyListeners_('list', this.list_);
    }
    
    public AddComposed(prop: string, prefix?: string, targetPath?: string){
        const change: IChange = {
            componentId: this.componentId_,
            type: 'set',
            path: (prefix ? `${prefix}.${prop}` : prop),
            prop: prop,
            origin: this.origins_.Peek(),
        };

        if (targetPath){//Bubbled change
            this.Add({
                original: change,
                path: targetPath,
            });
        }
        else{
            this.Add(change);
        }
    }

    public GetLastChange(index = 0): IChange | IBubbledChange | null{
        return DeepCopy(this.list_.at(-(index + 1)) || null);
    }

    public PushOrigin(origin: ChangeCallbackType){
        this.origins_.Push(origin);
        this.NotifyListeners_('origins', this.origins_);
    }

    public PeekOrigin(): ChangeCallbackType | null{
        return this.origins_.Peek();
    }

    public PopOrigin(): ChangeCallbackType | null{
        const origin = this.origins_.Pop();
        this.NotifyListeners_('origins', this.origins_);
        return origin;
    }

    public Subscribe(path: string, handler: ChangeCallbackType){
        const id = FindComponentById(this.componentId_)?.GenerateUniqueId('sub_');
        if (id){//Add new subscription
            (this.subscribers_[path] = (this.subscribers_[path] || {}))[id] = handler;
            this.subscriberPaths_[id] = path;
            this.NotifyListeners_('subscribers', this.subscribers_);
        }
        
        return (id || '');
    }

    public Unsubscribe(subscribed: ChangeCallbackType | string, path?: string){
        if (typeof subscribed !== 'string'){
            const paths = (path ? [path] : Object.keys(this.subscribers_));
            paths.forEach(p => {
                if (p in this.subscribers_){
                    Object.entries(this.subscribers_[p])
                        .filter(([id, entry]) => (subscribed === entry))
                        .map(([id]) => id)
                        .forEach(id => this.Unsubscribe_(id));
                }
            });
        }
        else if (subscribed in this.subscriberPaths_){
            this.Unsubscribe_(subscribed);
        }

        this.NotifyListeners_('subscribers', this.subscribers_);
    }

    public Destroy(){
        if (this.isDestroyed_) return;

        this.isDestroyed_ = true;
        this.componentId_ = '';
        
        this.nextTickHandlers_.splice(0);
        this.nextIdleHandlers_.splice(0);
        this.nextNonIdleHandlers_.splice(0);

        this.isScheduled_ = false;
        this.isIdle_ = true;

        this.list_.splice(0);
        this.subscribers_ = {};
        this.subscriberPaths_ = {};

        this.origins_.Purge();
    }

    private Unsubscribe_(id: string){
        const path = this.subscriberPaths_[id];
        if (path && path in this.subscribers_ && id in this.subscribers_[path]){
            delete this.subscribers_[path][id];
            delete this.subscriberPaths_[id];
            if (Object.keys(this.subscribers_[path]).length == 0){
                delete this.subscribers_[path];
            }
        }
    }
}
