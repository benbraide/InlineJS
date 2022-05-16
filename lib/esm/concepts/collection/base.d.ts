import { CollectionEntryType, CollectionIndexType, ICollectionConcept, ICollectionImportParams, ICollectionItem, ICollectionOptions, ICollectionUpdateParams } from "../../types/collection";
import { IComponent } from "../../types/component";
export declare class CollectionConcept implements ICollectionConcept {
    protected name_: string;
    protected component_?: IComponent | undefined;
    protected id_: string;
    protected options_: ICollectionOptions;
    protected queuedTasks_: Array<() => void> | null;
    protected items_: ICollectionItem[];
    protected itemProxies_: CollectionEntryType[];
    protected keyedItems_: Record<string, CollectionEntryType>;
    protected keyedProxy_: any;
    constructor(name_: string, component_?: IComponent | undefined, options?: ICollectionOptions);
    GetName(): string;
    SetOptions(options: ICollectionOptions): void;
    SetOption(key: keyof ICollectionOptions, value: any): void;
    GetOptions(): ICollectionOptions;
    GetOption(key: keyof ICollectionOptions): string | Record<string, any> | undefined;
    GetKeyedProxy(): any;
    GetItems(): Array<CollectionEntryType>;
    GetItemProxies(): Array<CollectionEntryType>;
    GetCount(): number;
    GetKeyedItem(index: CollectionIndexType): CollectionEntryType;
    FindItem(index: CollectionIndexType): {
        [x: string]: number | CollectionEntryType;
        quantity: number;
    } | null;
    Import({ list, incremental, alertType }: ICollectionImportParams): any;
    Export(): Array<ICollectionItem>;
    UpdateItem({ index, quantity, entry, incremental, alertType, callback }: ICollectionUpdateParams): any;
    AddItem(entry: CollectionEntryType, quantity: number): void;
    RemoveItem(index: CollectionIndexType): void;
    RemoveAll(): any;
    protected EnterQueueMode_(): void;
    protected LeaveQueueMode_(): void;
    protected GetItems_(): Array<CollectionEntryType>;
    protected FindItemIndex_(index: CollectionIndexType): number;
    protected FindItem_(index: CollectionIndexType): ICollectionItem | null;
    protected InitItem_(entry: CollectionEntryType): ICollectionItem;
    protected CreateItemProxy_(entryName: string, index: CollectionIndexType, getItem: () => ICollectionItem | null): object;
    protected MapToExternalItem_(index: string, item: ICollectionItem): {
        [x: string]: number | CollectionEntryType;
        quantity: number;
    };
    protected ExtractIndex_(item: CollectionEntryType): CollectionIndexType;
    protected AlertUpdate_(): void;
}
