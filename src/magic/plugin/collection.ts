import { GetGlobal } from "../../global/get";
import { CollectionEntryType, CollectionIndexType, ICollectionImportParams, ICollectionOptions, ICollectionUpdateParams } from "../../types/collection";

export function BuildCollectionMethods(name: string){
    return {
        setOptions: (options: ICollectionOptions) => GetGlobal().GetCollectionConcept(name)?.SetOptions(options),
        setOption: (key: keyof ICollectionOptions, value: any) => GetGlobal().GetCollectionConcept(name)?.SetOption(key, value),
        getOptions: () => GetGlobal().GetCollectionConcept(name)?.GetOptions(),
        getOption: (key: keyof ICollectionOptions) => GetGlobal().GetCollectionConcept(name)?.GetOption(key),
        getItems: () => GetGlobal().GetCollectionConcept(name)?.GetItems(),
        getCount: () => GetGlobal().GetCollectionConcept(name)?.GetCount(),
        getKeyedItem: (index: CollectionIndexType) => GetGlobal().GetCollectionConcept(name)?.GetKeyedItem(index),
        findItem: (index: CollectionIndexType) => GetGlobal().GetCollectionConcept(name)?.FindItem(index),
        import: (params: ICollectionImportParams) => GetGlobal().GetCollectionConcept(name)?.Import(params),
        export: () => GetGlobal().GetCollectionConcept(name)?.Export(),
        updateItem: (params: ICollectionUpdateParams) => GetGlobal().GetCollectionConcept(name)?.UpdateItem(params),
        addItem: (entry: CollectionEntryType, quantity: number) => GetGlobal().GetCollectionConcept(name)?.AddItem(entry, quantity),
        removeItem: (index: CollectionIndexType) => GetGlobal().GetCollectionConcept(name)?.RemoveItem(index),
        removeAll: () => GetGlobal().GetCollectionConcept(name)?.RemoveAll(),
    };
}
