export declare type CollectionIndexType = string;
export declare type CollectionEntryType = Record<string, any>;
export interface ICollectionItem {
    quantity: number;
    entry: CollectionEntryType;
}
export interface ICollectionOptions {
    indexName: string;
    indexNamePlural?: string;
    entryName?: string;
    caches?: Record<string, (items?: Array<ICollectionItem>) => any>;
    props?: Record<string, any>;
    path?: string;
}
export interface ICollectionImportParams {
    list: Array<ICollectionItem> | Promise<Array<ICollectionItem>>;
    incremental?: boolean;
    alertType?: 'none' | 'item' | 'all';
}
export interface ICollectionUpdateParams {
    index: CollectionIndexType;
    quantity: number;
    entry?: CollectionEntryType;
    incremental?: boolean;
    alertType?: 'none' | 'item' | 'all';
    callback?: (item: ICollectionItem) => void;
}
export interface ICollectionConcept {
    GetName(): string;
    SetOptions(options: ICollectionOptions): void;
    SetOption(key: keyof ICollectionOptions, value: any): void;
    GetOptions(): ICollectionOptions;
    GetOption(key: keyof ICollectionOptions): any;
    GetKeyedProxy(): any;
    GetItems(): Array<CollectionEntryType>;
    GetItemProxies(): Array<CollectionEntryType>;
    GetCount(): number;
    GetKeyedItem(index: CollectionIndexType): CollectionEntryType;
    FindItem(index: CollectionIndexType): CollectionEntryType | null;
    Import(params: ICollectionImportParams): void;
    Export(): Array<ICollectionItem>;
    UpdateItem(params: ICollectionUpdateParams): void;
    AddItem(entry: CollectionEntryType, quantity: number): void;
    RemoveItem(index: CollectionIndexType): void;
    RemoveAll(): void;
}
export interface ICartOffsetHandlerParams {
    subTotal: number;
    items: Array<CollectionEntryType>;
}
export declare type CartOffsetHandlerType = (params: ICartOffsetHandlerParams) => any;
export interface ICartCollectionConcept {
    AddOffset(key: string, handler: CartOffsetHandlerType, initValue?: any): void;
    RemoveOffset(key: string): void;
    GetOffset(key: string): any;
}
