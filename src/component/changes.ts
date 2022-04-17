import { JournalError } from "../journal/error";
import { Stack } from "../stack";
import { ChangeCallbackType, IBubbledChange, IChange } from "../types/change";
import { IChanges, IGetAccessDetails, IGetAccessStorage, IGetAccessStorageDetails, ISubscriberInfo } from "../types/changes";
import { DeepCopy } from "../utilities/deep-copy";
import { PeekCurrentComponent } from "./current";
import { FindComponentById } from "./find";

interface IChangeBatchInfo{
    callback: ChangeCallbackType;
    changes: Array<IChange | IBubbledChange>;
}

export class Changes implements IChanges{
    private nextTickHandlers_ = new Array<() => void>();

    private isScheduled_ = false;
    private list_ = new Array<IChange | IBubbledChange>();
    private subscribers_: Record<string, ISubscriberInfo> = {};

    private lastAccessContext_ = '';
    private getAccessStorages_ = new Stack<IGetAccessStorage>();
    private origins_ = new Stack<ChangeCallbackType>();
    
    public constructor(private componentId_: string){}
    
    public GetComponentId(){
        return this.componentId_;
    }
    
    public AddNextTickHandler(handler: () => void){
        this.nextTickHandlers_.push(handler);
    }

    public Schedule(){
        if (this.isScheduled_){
            return;
        }

        this.isScheduled_ = true;
        queueMicrotask(() => {//Defer dispatches
            this.isScheduled_ = false;

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
            this.nextTickHandlers_.splice(0).forEach((handler) => {
                try{
                    handler();
                }
                catch (err){
                    JournalError(err, `InlineJs.Region<${this.componentId_}>.NextTick`);
                }
            });
        });
    }
    
    public Add(change: IChange | IBubbledChange){
        this.list_.push(change);
        this.Schedule();
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
        this.lastAccessContext_ = ((lastPointIndex == -1) ? '' : path.substring(0, lastPointIndex));
        
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
    }

    public GetLastAccessContext(){
        return this.lastAccessContext_;
    }

    public ResetLastAccessContext(){
        this.lastAccessContext_ = '';
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
    }
    
    public PopGetAccessStorage(): IGetAccessStorageDetails | null{
        return (this.getAccessStorages_.Pop()?.details || null);
    }

    public SwapOptimizedGetAccessStorage(){
        let storage = this.getAccessStorages_.Peek();
        if (storage?.details.optimized && storage.details.raw){
            storage.details.optimized.entries = storage.details.raw.entries;
        }
    }

    public RestoreOptimizedGetAccessStorage(){
        let storage = this.getAccessStorages_.Peek();
        if (storage?.details.optimized && storage.details.optimized.entries === storage.details.raw?.entries){
            storage.details.optimized.entries = storage.details.raw.entries.slice(0);
        }
    }

    public FlushRawGetAccessStorage(){
        this.getAccessStorages_.Peek()?.details.raw?.entries.splice(0);
    }

    public PushGetAccessStorageSnapshot(){
        let storage = this.getAccessStorages_.Peek();
        storage?.details.optimized?.snapshots.Push(storage.details.optimized.entries.slice(0).map(entry => ({ ...entry })));
        storage?.details.raw?.snapshots.Push(storage.details.raw.entries.slice(0).map(entry => ({ ...entry })));
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
    }

    public PushOrigin(origin: ChangeCallbackType){
        this.origins_.Push(origin);
    }

    public PeekOrigin(): ChangeCallbackType | null{
        return this.origins_.Peek();
    }

    public PopOrigin(): ChangeCallbackType | null{
        return this.origins_.Pop();
    }

    public Subscribe(path: string, handler: ChangeCallbackType){
        let id = FindComponentById(this.componentId_)?.GenerateUniqueId('sub_');
        if (id){//Add new subscription
            this.subscribers_[id] = {
                path: path,
                callback: handler,
            };
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
    }

    private Unsubscribe_(id: string){
        delete this.subscribers_[id];
    }
}
