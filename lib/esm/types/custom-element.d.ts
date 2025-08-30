import { IComponent } from "./component";
import { IElementScope } from "./element-scope";
export interface IElementScopeCreatedCallbackParams {
    componentId: string;
    component: IComponent | null;
    scope: IElementScope;
}
export interface ICustomElement {
    IsTemplate(): boolean;
    OnElementScopeCreated(params: IElementScopeCreatedCallbackParams): void;
    OnElementScopeMarked(scope: IElementScope): void;
    OnElementScopeDestroyed(scope: IElementScope): void;
}
