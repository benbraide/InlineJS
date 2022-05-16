import { GetGlobal } from "../../global/get";
export function BuildCollectionMethods(name) {
    const getCollectionConcept = () => GetGlobal().GetConcept(name);
    return {
        setOptions: (options) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.SetOptions(options); },
        setOption: (key, value) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.SetOption(key, value); },
        getOptions: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetOptions(); },
        getOption: (key) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetOption(key); },
        getItems: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetItems(); },
        getCount: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetCount(); },
        getKeyedItem: (index) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetKeyedItem(index); },
        findItem: (index) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.FindItem(index); },
        import: (params) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Import(params); },
        export: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Export(); },
        updateItem: (params) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.UpdateItem(params); },
        addItem: (entry, quantity) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.AddItem(entry, quantity); },
        removeItem: (index) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.RemoveItem(index); },
        removeAll: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.RemoveAll(); },
    };
}
