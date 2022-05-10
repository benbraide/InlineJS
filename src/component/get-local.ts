import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";
import { IElementScope } from "../types/element-scope";
import { FindComponentById } from "./find";

export function GetLocal(element: HTMLElement | IElementScope, name: string, component?: IComponent | string | null, defaultValue = {}){
    let elementScope: IElementScope | null = null;
    if (element instanceof HTMLElement){
        elementScope = (((typeof component === 'string') ? FindComponentById(component) : component)?.FindElementScope(element) || null);
    }
    else{
        elementScope = element;
    }
    
    if (!elementScope){
        return defaultValue;
    }

    let value = elementScope.GetLocal(name);
    if (GetGlobal().IsNothing(value)){//Create key
        elementScope.SetLocal(name, (value = defaultValue));
    }

    return value;
}
