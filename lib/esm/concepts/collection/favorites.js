import { CollectionConcept } from "./base";
export class FavoritesCollectionConcept extends CollectionConcept {
    constructor(component, options) {
        super('favorites', component, options);
    }
}
