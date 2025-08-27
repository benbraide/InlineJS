import { JournalTry } from "../journal/try";
import { Stack } from "../stack";
import { ChangeCallbackType, IBubbledChange, IChange } from "../types/change";
import { IChanges } from "../types/changes";
import { DeepCopy } from "../utilities/deep-copy";
import { ChangesMonitor } from "./changes-monitor";
import { FindComponentById } from "./find";

export class Changes extends ChangesMonitor implements IChanges{
    protected nextTickHandlers_ = new Array<() => void>();// Gets notified at the end of a schedule run
    protected nextIdleHandlers_ = new Array<() => void>();// Gets notified when a scheduke runs without any changes
    protected nextNonIdleHandlers_ = new Array<() => void>();// Gets notified when a schedule runs with changes

    protected isScheduled_ = false;
    protected isIdle_ = true;
    protected isDestroyed_ = false;

    protected list_ = new Array<IChange | IBubbledChange>();
    protected subscribers_: Record<string, Record<string, ChangeCallbackType>> = {};
    protected subscriberPaths_: Record<string, string> = {};

    protected origins_ = new Stack<ChangeCallbackType>();
    protected recentRemovals_: Array<ChangeCallbackType> | null = null;
    
    public constructor(protected componentId_: string){
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
                if (this.recentRemovals_?.includes(callback)) return;

                const batch = batches.get(callback) || [];
                batch.push(change);
                batches.set(callback, batch);
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

            const after = () => {
                if (this.nextTickHandlers_.length != 0){
                    this.nextTickHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextTick`));
                    this.NotifyListeners_('next-tick-handlers', this.nextTickHandlers_);
                }

                this.recentRemovals_ = null;
            };

            if (batches.size == 0) {// Idle
                this.isIdle_ = true;

                if (this.nextIdleHandlers_.length != 0) { //Always check for idle handlers if there are no batches
                    this.nextIdleHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextIdle`));
                    this.NotifyListeners_('next-idle-handlers', this.nextIdleHandlers_);
                }
                
                after();

                return;
            }

            this.isIdle_ = false;

            batches.forEach((changes, callback) => {
                !this.recentRemovals_?.includes(callback) && JournalTry(() => callback(changes), `InlineJs.Region<${this.componentId_}>.Schedule`);
            });
            
            if (this.nextNonIdleHandlers_.length != 0) { //Always check for non-idle handlers if there are batches
                this.nextNonIdleHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextNonIdle`));
                this.NotifyListeners_('next-non-idle-handlers', this.nextNonIdleHandlers_);
            }

            after();
            
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
        this.recentRemovals_ = this.recentRemovals_ || [];
        
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

    protected Unsubscribe_(id: string){
        const path = this.subscriberPaths_[id];
        if (path && path in this.subscribers_ && id in this.subscribers_[path]){
            this.recentRemovals_?.push(this.subscribers_[path][id]);
            
            delete this.subscribers_[path][id];
            delete this.subscriberPaths_[id];
            
            if (Object.keys(this.subscribers_[path]).length == 0){
                delete this.subscribers_[path];
            }
        }
    }
}
