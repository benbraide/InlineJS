import { GetGlobal } from "../../global/get";
import { JournalTry } from "../../journal/try";
import { AddChanges } from "../../proxy/add-changes";
import { CartOffsetHandlerType, ICartCollectionConcept, ICollectionOptions } from "../../types/collection";
import { IComponent } from "../../types/component";
import { DeepCopy } from "../../utilities/deep-copy";
import { IsEqual } from "../../utilities/is-equal";
import { CollectionConcept } from "./base";

export class CartCollectionConcept extends CollectionConcept implements ICartCollectionConcept{
    private offsets_: Record<string, any> = {};
    private offsetHandlers_: Record<string, CartOffsetHandlerType> = {};
    
    public constructor(component?: IComponent, options?: ICollectionOptions){
        super('cart', component, options);
        this.offsetHandlers_['subTotal'] = ({ subTotal }) => subTotal;
        this.offsets_['subTotal'] = 0;
    }

    public AddOffset(key: string, handler: CartOffsetHandlerType, initValue: any = GetGlobal().CreateNothing()){
        this.offsetHandlers_[key] = handler;
        if (!GetGlobal().IsNothing(initValue)){
            this.offsets_[key] = initValue;
        }
    }

    public RemoveOffset(key: string){
        delete this.offsetHandlers_[key];
    }

    public GetOffset(key: string){
        this.component_?.GetBackend().changes.AddGetAccess(`${this.id_}.offsets.${key}`);
        if (!this.offsets_.hasOwnProperty(key)){
            if (key === 'total'){
                return (Object.values(this.offsets_).filter(value => (typeof value === 'number')).reduce((prev, value) => (prev + value), 0) || 0);
            }
            return GetGlobal().CreateNothing();
        }

        let value = this.offsets_[key];
        return (GetGlobal().IsFuture(value) ? value.Get() : value);
    }

    protected AlertUpdate_(){
        let subTotal = this.items_.reduce((prev, item) => (prev + ((item.entry.price || 0) * item.quantity)), 0), items = this.GetItems_();
        Object.entries(this.offsetHandlers_).forEach(([key, handler]) => JournalTry(() => {
            let value = handler({ subTotal, items });
            if (!IsEqual(this.offsets_[key], value)){
                this.offsets_[key] = DeepCopy(value);
                AddChanges('set', `${this.id_}.offsets.${key}`, key, this.component_?.GetBackend().changes);
            }
        }, 'InlineJS.CartCollectionConcept.AfterUpdate'));

        if (!this.offsets_.hasOwnProperty('total')){
            AddChanges('set', `${this.id_}.offsets.total`, 'total', this.component_?.GetBackend().changes);
        }
        
        super.AlertUpdate_();
    }
}
