import { WaitPromise } from "../../evaluator/wait-promise";
import { JournalTry } from "../../journal/try";
import { CollectionEntryType, CollectionIndexType, ICollectionConcept, ICollectionExtractedItem, ICollectionImportParams, ICollectionItem, ICollectionOptions, ICollectionUpdateParams } from "../../types/collection";
import { Loop } from "../../values/loop";

const DefaultCollectionOptions: ICollectionOptions = {
    indexName: 'id',
    indexNamePlural: 'ids',
    entryName: 'entry',
};

interface ICollectionItemInfo{
    item: ICollectionItem;
    loop?: Loop<CollectionEntryType>;
    loopDoWhile?: (value: CollectionEntryType) => void;
}

export class CollectionConcept implements ICollectionConcept{
    protected options_ = DefaultCollectionOptions;
    protected items_: Record<string, ICollectionItemInfo> = {};
    protected queuedTasks_: Array<() => void> | null = null;
    
    protected itemsLoop_: Loop<Array<CollectionEntryType>>;
    protected itemsLoopDoWhile_?: (value: Array<CollectionEntryType>) => void;

    protected countLoop_: Loop<number>;
    protected countLoopDoWhile_?: (value: number) => void;
    
    public constructor(protected name_: string, options?: ICollectionOptions){
        if (options){
            Object.entries(options).forEach(([key, value]) => (this.options_[key] = value));
        }

        this.itemsLoop_ = new Loop<Array<CollectionEntryType>>(doWhile => (this.itemsLoopDoWhile_ = doWhile));
        this.countLoop_ = new Loop<number>(doWhile => (this.countLoopDoWhile_ = doWhile));
    }
    
    public GetName(){
        return this.name_;
    }

    public SetOptions(options: ICollectionOptions){
        this.options_ = options;
    }

    public SetOption(key: keyof ICollectionOptions, value: any){
        this.options_[key] = value;
    }

    public GetOptions(){
        return this.options_;
    }

    public GetOption(key: keyof ICollectionOptions){
        return (this.options_.hasOwnProperty(key) ? this.options_[key] : undefined);
    }

    public GetItems(){
        return Object.entries(this.items_).map(([key, value]) => this.MapToExternalItem_(key, value.item));
    }

    public WatchItems(){
        return this.itemsLoop_;
    }
    
    public FindItem(index: CollectionIndexType){
        return (this.items_.hasOwnProperty(index) ? this.MapToExternalItem_(index, this.items_[index].item) : null);
    }

    public WatchItem(index: CollectionIndexType){
        return this.GetItemLoop_(this.GetOrInitItem_(index));
    }

    public GetCount(){
        return Object.values(this.items_).reduce((prev, info) => (prev + info.item.quantity), 0);
    }

    public WatchCount(){
        return this.countLoop_;
    }

    public Import({ list, incremental, alertType }: ICollectionImportParams){
        if (this.queuedTasks_){
            return this.queuedTasks_.push(() => this.Import({ list, incremental, alertType }));
        }
        
        this.EnterQueueMode_();
        WaitPromise(list, (list) => {
            this.LeaveQueueMode_();
            (list as Array<ICollectionExtractedItem>).forEach((entry) => {
                this.UpdateItem({ entry, incremental,
                    index: this.ExtractIndex_(entry),
                    quantity: entry.quantity,
                    alertType: 'none',
                });
            });

            if (alertType !== 'none' && alertType !== 'item'){
                window.dispatchEvent(new CustomEvent(`${this.name_}.import`, {
                    detail: { list: (list as Array<ICollectionExtractedItem>).map(item => this.MapToExternalItem_(item.index, item)) },
                }));
                this.AlertUpdate_();
            }
        });
    }

    public Export(): Array<ICollectionExtractedItem>{
        return Object.entries(this.items_).map(([key, value]) => ({ ...value.item, index: key }));
    }

    public UpdateItem({ index, quantity, entry, incremental, alertType }: ICollectionUpdateParams){
        if (this.queuedTasks_){
            return this.queuedTasks_.push(() => this.UpdateItem({ index, quantity, entry, incremental, alertType }));
        }
        
        let { item, loopDoWhile } = this.GetOrInitItem_(index), count = item.quantity;
        if (count == 0 && entry){//Update entry
            item.entry = entry;
        }

        item.quantity = (incremental ? (item.quantity + quantity) : quantity);
        item.quantity = ((item.quantity < 0) ? 0 : item.quantity);

        if (item.quantity == count){//No changes
            return;
        }
        
        if (loopDoWhile){
            loopDoWhile!(this.MapToExternalItem_(index, item));
        }

        if (alertType !== 'none'){//Alert item update
            window.dispatchEvent(new CustomEvent(`${this.name_}.item`, {
                detail: { item: this.MapToExternalItem_(index, item) },
            }));
        }
        
        if (alertType !== 'none' && alertType !== 'item'){//Alert update to list
            this.AlertUpdate_();
        }
    }

    public RemoveAll(){
        if (this.queuedTasks_){
            return this.queuedTasks_.push(() => this.RemoveAll());
        }

        Object.keys(this.items_).forEach((key) => {
            this.UpdateItem({ index: key, quantity: 0, incremental: false, alertType: 'none' });
        });

        window.dispatchEvent(new CustomEvent(`${this.name_}.clear`));
        this.AlertUpdate_();
    }

    protected EnterQueueMode_(){
        if (!this.queuedTasks_){
            this.queuedTasks_ = new Array<() => void>();
        }
    }

    protected LeaveQueueMode_(){
        if (this.queuedTasks_){
            this.queuedTasks_.forEach(task => JournalTry(task, 'InlineJS.CollectionConcept.QueuedTask'));
            this.queuedTasks_ = null;
        }
    }

    protected InitItem_(index: CollectionIndexType){
        this.items_[index] = {
            item: { quantity: 0, entry: {} },
        };

        return this.items_[index];
    }

    protected GetOrInitItem_(index: CollectionIndexType){
        if (!this.items_.hasOwnProperty(index)){
            this.InitItem_(index);
        }
        return this.items_[index];
    }

    protected GetItemLoop_(info: ICollectionItemInfo){
        if (!info.loop){
            info.loop = new Loop<CollectionEntryType>(doWhile => (info.loopDoWhile = doWhile));
        }
        return info.loop;
    }

    protected MapToExternalItem_(index: string, item: ICollectionItem){
        return { index,
            quantity: item.quantity,
            [this.options_.entryName || DefaultCollectionOptions.entryName!]: item.entry,
        };
    }

    protected MapFromExternalItem_(item: CollectionEntryType){
        let entry = item[this.options_.entryName || DefaultCollectionOptions.entryName!];
        return <ICollectionExtractedItem>{ entry,
            index: this.ExtractIndex_(item),
            quantity: item['quantity'],
        };
    }

    protected ExtractIndex_(item: CollectionEntryType){
        let indexName = (this.options_.indexName || DefaultCollectionOptions.indexName);
        let entry = item[this.options_.entryName || DefaultCollectionOptions.entryName!];
        return (item.hasOwnProperty(indexName) ? item[indexName] : entry[indexName]);
    }

    protected AlertUpdate_(){
        this.itemsLoopDoWhile_!(this.GetItems());
        this.countLoopDoWhile_!(this.GetCount());
        window.dispatchEvent(new CustomEvent(`${this.name_}.update`));
    }
}
