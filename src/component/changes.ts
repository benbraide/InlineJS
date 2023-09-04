import { JournalTry } from "../journal/try";
import { Stack } from "../stack";
import { ChangeCallbackType, IBubbledChange, IChange } from "../types/change";
import { IChanges, IGetAccessDetails, IGetAccessStorage, IGetAccessStorageDetails, ISubscriberInfo } from "../types/changes";
import { DeepCopy } from "../utilities/deep-copy";
import { ChangesMonitor } from "./changes-monitor";
import { PeekCurrentComponent } from "./current";
import { FindComponentById } from "./find";

interface IChangeBatchInfo{
    callback: ChangeCallbackType;
    changes: Array<IChange | IBubbledChange>;
}

export class Changes extends ChangesMonitor implements IChanges{
    private nextTickHandlers_ = new Array<() => void>();
    private nextIdleHandlers_ = new Array<() => void>();
    private nextNonIdleHandlers_ = new Array<() => void>();

    private isScheduled_ = false;
    private isIdle_ = true;

    private list_ = new Array<IChange | IBubbledChange>();
    private subscribers_: Record<string, ISubscriberInfo> = {};

    private lastAccessContext_ = '';
    private getAccessStorages_ = new Stack<IGetAccessStorage>();
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
        if (this.isScheduled_){
            return;
        }

        this.isScheduled_ = true;
        queueMicrotask(() => {//Defer dispatches
            this.isScheduled_ = false;

            if (this.isIdle_){
                this.isIdle_ = false;
                this.nextNonIdleHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextNonIdle`));
            }

            let batches = new Array<IChangeBatchInfo>(), addBatch = (change: IChange | IBubbledChange, callback: ChangeCallbackType) => {
                let batch = batches.find(info => (info.callback === callback));
                if (!batch){
                    batches.push({
                        callback: callback,
                        changes: new Array(change),
                    });
                }
                else{//Add to existing batch
                    batch.changes.push(change);
                }
            };

            let getOrigin = (change: IChange | IBubbledChange) => (('original' in change) ? change.original.origin : change.origin);
            this.list_.splice(0).forEach((change) => {//Process changes into batches
                Object.values(this.subscribers_).filter(sub => (sub.path === change.path && sub.callback !== getOrigin(change))).forEach(sub => addBatch(change, sub.callback));
            });

            batches.forEach(batch => batch.callback(batch.changes));
            this.nextTickHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextTick`));
            
            if (!this.isScheduled_){
                this.isIdle_ = true;
                this.nextIdleHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextIdle`));
            }
        });

        this.NotifyListeners_('scheduled', this.isScheduled_);
    }
    
    public Add(change: IChange | IBubbledChange){
        this.list_.push(change);
        this.Schedule();
        this.NotifyListeners_('list', this.list_);
    }
    
    public AddComposed(prop: string, prefix?: string, targetPath?: string){
        let change: IChange = {
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

    public AddGetAccess(path: string){
        let targetObject = (<Changes>FindComponentById(PeekCurrentComponent() || '')?.GetBackend().changes || this);
        
        let lastPointIndex = path.lastIndexOf('.');
        targetObject.lastAccessContext_ = ((lastPointIndex == -1) ? '' : path.substring(0, lastPointIndex));
        
        let storage = targetObject.getAccessStorages_.Peek();
        if (!storage?.details){
            return;
        }

        storage.details.raw?.entries.push({
            compnentId: this.componentId_,
            path: path,
        });

        if (storage.details.optimized && storage.details.optimized.entries !== storage.details.raw?.entries && //Optimized is not linked to raw
            storage.details.optimized.entries.length != 0 && //Optimized list is not empty
            storage.lastAccessPath && storage.lastAccessPath.length < path.length && //Last access path is possibly a substring of path
            path.indexOf(`${storage.lastAccessPath}.`) == 0 //Last access path is confirmed as a substring of path
        ){
            storage.details.optimized.entries.at(-1)!.path = path; //Replace last optimized entry
        }
        else if (storage.details.optimized && storage.details.optimized.entries !== storage.details.raw?.entries){ //Add a new optimized entry
            storage.details.optimized.entries.push({
                compnentId: this.componentId_,
                path: path,
            });
        }

        storage.lastAccessPath = path; //Update last access path
        this.NotifyListeners_('last-access-context', this.list_);
        targetObject.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }

    public GetLastAccessContext(){
        return this.lastAccessContext_;
    }

    public ResetLastAccessContext(){
        this.lastAccessContext_ = '';
        this.NotifyListeners_('last-access-context', this.lastAccessContext_);
    }
    
    public PushGetAccessStorage(storage?: IGetAccessStorageDetails){
        this.getAccessStorages_.Push({
            details: (storage || {
                optimized: ((FindComponentById(this.componentId_)?.GetReactiveState() === 'optimized') ? {
                    entries: new Array<IGetAccessDetails>(),
                    snapshots: new Stack<Array<IGetAccessDetails>>(),
                } : undefined),
                raw: {
                    entries: new Array<IGetAccessDetails>(),
                    snapshots: new Stack<Array<IGetAccessDetails>>(),
                },
            }),
            lastAccessPath: '',
        });
        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }
    
    public PopGetAccessStorage(): IGetAccessStorageDetails | null{
        let details = (this.getAccessStorages_.Pop()?.details || null);
        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
        return details;
    }

    public SwapOptimizedGetAccessStorage(){
        let storage = this.getAccessStorages_.Peek();
        if (storage?.details.optimized && storage.details.raw){
            storage.details.optimized.entries = storage.details.raw.entries;
            this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
        }
    }

    public RestoreOptimizedGetAccessStorage(){
        let storage = this.getAccessStorages_.Peek();
        if (storage?.details.optimized && storage.details.optimized.entries === storage.details.raw?.entries){
            storage.details.optimized.entries = storage.details.raw.entries.slice(0);
            this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
        }
    }

    public FlushRawGetAccessStorage(){
        this.getAccessStorages_.Peek()?.details.raw?.entries.splice(0);
        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }

    public PushGetAccessStorageSnapshot(){
        let storage = this.getAccessStorages_.Peek();
        storage?.details.optimized?.snapshots.Push(storage.details.optimized.entries.slice(0).map(entry => ({ ...entry })));
        storage?.details.raw?.snapshots.Push(storage.details.raw.entries.slice(0).map(entry => ({ ...entry })));
        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }

    public PopGetAccessStorageSnapshot(discard?: boolean){
        let storage = this.getAccessStorages_.Peek();

        let optimizedSnapshot = storage?.details.optimized?.snapshots.Pop();
        if (!discard && optimizedSnapshot && storage?.details.optimized?.entries){
            storage.details.optimized.entries = optimizedSnapshot;
        }

        let rawSnapshot = storage?.details.raw?.snapshots.Pop();
        if (!discard && rawSnapshot && storage?.details.raw?.entries){
            storage.details.raw.entries = rawSnapshot;
        }

        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }
    
    public PopAllGetAccessStorageSnapshots(discard?: boolean){
        let storage = this.getAccessStorages_.Peek();

        let optimizedSnapshot = storage?.details.optimized?.snapshots.Pop();
        while (storage?.details.optimized?.snapshots && !storage.details.optimized.snapshots.IsEmpty()){
            optimizedSnapshot = storage.details.optimized.snapshots.Pop();
        }

        if (!discard && optimizedSnapshot && storage?.details.optimized?.entries){
            storage.details.optimized.entries = optimizedSnapshot;
        }

        let rawSnapshot = storage?.details.raw?.snapshots.Pop();
        while (storage?.details.raw?.snapshots && !storage.details.raw.snapshots.IsEmpty()){
            rawSnapshot = storage.details.raw.snapshots.Pop();
        }

        if (!discard && rawSnapshot && storage?.details.raw?.entries){
            storage.details.raw.entries = rawSnapshot;
        }

        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }

    public PushOrigin(origin: ChangeCallbackType){
        this.origins_.Push(origin);
        this.NotifyListeners_('origins', this.origins_);
    }

    public PeekOrigin(): ChangeCallbackType | null{
        return this.origins_.Peek();
    }

    public PopOrigin(): ChangeCallbackType | null{
        let origin = this.origins_.Pop();
        this.NotifyListeners_('origins', this.origins_);
        return origin;
    }

    public Subscribe(path: string, handler: ChangeCallbackType){
        let id = FindComponentById(this.componentId_)?.GenerateUniqueId('sub_');
        if (id){//Add new subscription
            this.subscribers_[id] = {
                path: path,
                callback: handler,
            };
            this.NotifyListeners_('subscribers', this.subscribers_);
        }
        
        return (id || '');
    }

    public Unsubscribe(subscribed: ChangeCallbackType | string, path?: string){
        if (typeof subscribed !== 'string'){
            Object.entries(this.subscribers_).filter(([id, entry]) => (subscribed === entry.callback && (!path || path === entry.path))).map(([id]) => id).forEach(id => {
                this.Unsubscribe_(id);
            });
        }
        else if (subscribed in this.subscribers_){
            this.Unsubscribe_(subscribed);
        }

        this.NotifyListeners_('subscribers', this.subscribers_);
    }

    private Unsubscribe_(id: string){
        delete this.subscribers_[id];
    }
}
