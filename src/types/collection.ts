import { Loop } from "../values/loop";

export type CollectionIndexType = string;
export type CollectionEntryType = Record<string, any>;

export interface ICollectionItem{
    quantity: number;
    entry: Record<string, any>;
}

export interface ICollectionExtractedItem extends ICollectionItem{
    index: CollectionIndexType;
}

export interface ICollectionOptions{
    indexName: string;
    indexNamePlural?: string;
    entryName?: string;
    caches?: Record<string, (items?: Array<ICollectionItem>) => any>;
    props?: Record<string, any>;
    path?: string;
}

export interface ICollectionImportParams{
    list: Array<ICollectionExtractedItem> | Promise<Array<ICollectionExtractedItem>>;
    incremental?: boolean;
    alertType?: 'none' | 'item' | 'all';
}

export interface ICollectionUpdateParams{
    index: CollectionIndexType;
    quantity: number;
    entry?: Record<string, any>;
    incremental?: boolean;
    alertType?: 'none' | 'item' | 'all';
}

export interface ICollectionConcept{
    GetName(): string;

    SetOptions(options: ICollectionOptions): void;
    SetOption(key: keyof ICollectionOptions, value: any): void;

    GetOptions(): ICollectionOptions;
    GetOption(key: keyof ICollectionOptions): any;

    GetItems(): Array<CollectionEntryType>;
    WatchItems(): Loop<Array<CollectionEntryType>>;
    
    FindItem(index: CollectionIndexType): CollectionEntryType | null;
    WatchItem(index: CollectionIndexType): Loop<CollectionEntryType>;

    GetCount(): number;
    WatchCount(): Loop<number>;

    Import(params: ICollectionImportParams): void;
    Export(): Array<ICollectionExtractedItem>;

    UpdateItem(params: ICollectionUpdateParams): void;
    RemoveAll(): void;
}
