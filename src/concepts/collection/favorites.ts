import { ICollectionOptions } from "../../types/collection";
import { IComponent } from "../../types/component";
import { CollectionConcept } from "./base";

export class FavoritesCollectionConcept extends CollectionConcept{
    public constructor(component?: IComponent, options?: ICollectionOptions){
        super('favorites', component, options);
    }
}
