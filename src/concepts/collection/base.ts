import { WaitPromise } from "../../evaluator/wait-promise";
import { JournalTry } from "../../journal/try";
import { JournalWarn } from "../../journal/warn";
import { AddChanges } from "../../proxy/add-changes";
import { BuildGetterProxyOptions, BuildProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { CollectionEntryType, CollectionIndexType, ICollectionConcept, ICollectionImportParams, ICollectionItem, ICollectionOptions, ICollectionUpdateParams } from "../../types/collection";
import { IComponent } from "../../types/component";

const DefaultCollectionOptions: ICollectionOptions = {
    indexName: 'id',
    indexNamePlural: 'ids',
    entryName: 'entry',
};

export class CollectionConcept implements ICollectionConcept{
    protected id_: string;
    protected options_ = DefaultCollectionOptions;
    protected queuedTasks_: Array<() => void> | null = null;

    protected items_ = new Array<ICollectionItem>();
    protected itemProxies_ = new Array<CollectionEntryType>();

    protected keyedItems_: Record<string, CollectionEntryType> = {};
    protected keyedProxy_: any;
    
    public constructor(protected name_: string, protected component_?: IComponent, options?: ICollectionOptions){
        this.id_ = (this.component_?.GenerateUniqueId('form_proxy_') || '');
        if (options){
            Object.entries(options).forEach(([key, value]) => (this.options_[key] = value));
        }

        this.keyedProxy_ = CreateInplaceProxy(BuildGetterProxyOptions({
            getter: (prop) => {
                if (prop){
                    return this.GetKeyedItem(prop);
                }
            },
        }));
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

    public GetKeyedProxy(){
        return this.keyedProxy_;
    }

    public GetItems(): Array<CollectionEntryType>{
        this.component_?.GetBackend().changes.AddGetAccess(`${this.id_}.items`);
        return this.GetItems_();
    }

    public GetItemProxies(): Array<CollectionEntryType>{
        this.component_?.GetBackend().changes.AddGetAccess(`${this.id_}.items`);
        return this.itemProxies_;
    }

    public GetCount(){
        this.component_?.GetBackend().changes.AddGetAccess(`${this.id_}.items.length`);
        return this.items_.reduce((prev, item) => (prev + item.quantity), 0);
    }
    
    public GetKeyedItem(index: CollectionIndexType){
        this.component_?.GetBackend().changes.AddGetAccess(`${this.id_}.items.${index}`);
        if (index in this.keyedItems_){
            return this.keyedItems_[index];
        }

        let entryName = (this.options_.entryName || DefaultCollectionOptions.entryName!);
        this.keyedItems_[index] = this.CreateItemProxy_(entryName, index, () => this.FindItem_(index));

        return this.keyedItems_[index];
    }

    public FindItem(index: CollectionIndexType){
        let found = this.FindItem_(index);
        return (found ? this.MapToExternalItem_(index, found) : null);
    }

    public Import({ list, incremental, alertType }: ICollectionImportParams){
        if (this.queuedTasks_){
            return this.queuedTasks_.push(() => this.Import({ list, incremental, alertType }));
        }
        
        this.EnterQueueMode_();
        WaitPromise(list, (list) => {
            this.LeaveQueueMode_();

            let updated = new Array<ICollectionItem>();
            (list as Array<ICollectionItem>).forEach((info) => {
                this.UpdateItem({ incremental,
                    index: this.ExtractIndex_(info.entry),
                    entry: info.entry,
                    quantity: info.quantity,
                    alertType: 'none',
                    callback: item => updated.push(item),
                });
            });

            if (alertType !== 'none' && alertType !== 'item'){
                window.dispatchEvent(new CustomEvent(`${this.name_}.import`, {
                    detail: { list: updated.map(item => this.MapToExternalItem_(this.ExtractIndex_(item.entry), item)) },
                }));
                this.AlertUpdate_();
            }
        });
    }

    public Export(): Array<ICollectionItem>{
        return this.items_.map(item => ({ ...item }));
    }

    public UpdateItem({ index, quantity, entry, incremental, alertType, callback }: ICollectionUpdateParams){
        if (this.queuedTasks_){
            return this.queuedTasks_.push(() => this.UpdateItem({ index, quantity, entry, incremental, alertType }));
        }
        
        let item = this.FindItem_(index);
        if (!item){//Initialize item
            if (!entry){//Invalid item
                return JournalWarn('Cannot update an invalid item.', 'InlineJS.CollectionConcept.UpdateItem');
            }
            item = this.InitItem_(entry);
        }

        let count = item.quantity;
        
        item.quantity = (incremental ? (item.quantity + quantity) : quantity);
        if (item.quantity <= 0){//Remove item
            let foundIndex = this.FindItemIndex_(index);
            this.items_.splice(foundIndex, 1);
            this.itemProxies_.splice(foundIndex, 1);
        }

        if (item.quantity == count){//No changes
            return;
        }

        AddChanges('set', `${this.id_}.items.${index}.quantity`, 'quantity', this.component_?.GetBackend().changes);
        if (callback){
            callback(item);
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

    public AddItem(entry: CollectionEntryType, quantity: number){
        this.UpdateItem({ entry, quantity,
            index: this.ExtractIndex_(entry),
        });
    }

    public RemoveItem(index: CollectionIndexType){
        this.UpdateItem({ index,
            quantity: 0,
            incremental: false,
        });
    }

    public RemoveAll(){
        if (this.queuedTasks_){
            return this.queuedTasks_.push(() => this.RemoveAll());
        }

        this.items_.slice(0).forEach(item => this.UpdateItem({ index: this.ExtractIndex_(item), quantity: 0, incremental: false, alertType: 'none' }));

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

    protected GetItems_(): Array<CollectionEntryType>{
        return this.items_.map(item => this.MapToExternalItem_(this.ExtractIndex_(item.entry), item));
    }

    protected FindItemIndex_(index: CollectionIndexType){
        let indexName = (this.options_.indexName || DefaultCollectionOptions.indexName);
        return this.items_.findIndex(item => (item.entry.hasOwnProperty(indexName) && item.entry[indexName] === index));
    }

    protected FindItem_(index: CollectionIndexType){
        let foundIndex = this.FindItemIndex_(index);
        return ((foundIndex == -1) ? null : this.items_[foundIndex]);
    }

    protected InitItem_(entry: CollectionEntryType): ICollectionItem{
        let entryName = (this.options_.entryName || DefaultCollectionOptions.entryName!), index = this.ExtractIndex_(entry), item = { entry,
            quantity: 0,
        };

        this.items_.push(item);
        this.itemProxies_.push(this.CreateItemProxy_(entryName, index, () => item));
        
        return item;
    }

    protected CreateItemProxy_(entryName: string, index: CollectionIndexType, getItem: () => ICollectionItem | null){
        return CreateInplaceProxy(BuildProxyOptions({
            getter: (prop) => {
                if (prop === 'quantity'){
                    this.component_?.GetBackend().changes.AddGetAccess(`${this.id_}.items.${index}.${prop}`);
                    return (getItem()?.quantity || 0);
                }

                if (prop === entryName){
                    return (getItem()?.entry || {});
                }
            },
            setter: (prop, value) => {
                if (prop === 'quantity'){//Update item quantity
                    let item = getItem();
                    if (item){
                        this.UpdateItem({ index,
                            quantity: value,
                        });
                    }
                }
                return true;
            },
            lookup: ['quantity', entryName],
        }))
    }

    protected MapToExternalItem_(index: string, item: ICollectionItem){
        return {
            quantity: item.quantity,
            [this.options_.entryName || DefaultCollectionOptions.entryName!]: item.entry,
        };
    }

    protected ExtractIndex_(item: CollectionEntryType): CollectionIndexType{
        let indexName = (this.options_.indexName || DefaultCollectionOptions.indexName);
        let entry = item[this.options_.entryName || DefaultCollectionOptions.entryName!];
        return (item.hasOwnProperty(indexName) ? item[indexName] : entry[indexName]);
    }

    protected AlertUpdate_(){
        AddChanges('set', `${this.id_}.items.length`, 'length', this.component_?.GetBackend().changes);
        window.dispatchEvent(new CustomEvent(`${this.name_}.update`));
    }
}
