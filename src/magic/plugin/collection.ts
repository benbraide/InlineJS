import { GetGlobal } from "../../global/get";
import { CollectionEntryType, CollectionIndexType, ICollectionConcept, ICollectionImportParams, ICollectionOptions, ICollectionUpdateParams } from "../../types/collection";

export function BuildCollectionMethods(name: string){
    const getCollectionConcept = () => GetGlobal().GetConcept<ICollectionConcept>(name);
    return {
        setOptions: (options: ICollectionOptions) => getCollectionConcept()?.SetOptions(options),
        setOption: (key: keyof ICollectionOptions, value: any) => getCollectionConcept()?.SetOption(key, value),
        getOptions: () => getCollectionConcept()?.GetOptions(),
        getOption: (key: keyof ICollectionOptions) => getCollectionConcept()?.GetOption(key),
        getItems: () => getCollectionConcept()?.GetItems(),
        getCount: () => getCollectionConcept()?.GetCount(),
        getKeyedItem: (index: CollectionIndexType) => getCollectionConcept()?.GetKeyedItem(index),
        findItem: (index: CollectionIndexType) => getCollectionConcept()?.FindItem(index),
        import: (params: ICollectionImportParams) => getCollectionConcept()?.Import(params),
        export: () => getCollectionConcept()?.Export(),
        updateItem: (params: ICollectionUpdateParams) => getCollectionConcept()?.UpdateItem(params),
        addItem: (entry: CollectionEntryType, quantity: number) => getCollectionConcept()?.AddItem(entry, quantity),
        removeItem: (index: CollectionIndexType) => getCollectionConcept()?.RemoveItem(index),
        removeAll: () => getCollectionConcept()?.RemoveAll(),
    };
}
