import { GetGlobal } from "../global/get";

export function IsBooleanAttribute(element: HTMLElement, name: string){
    if (element.hasOwnProperty('IsBooleanAttribute') && typeof element['IsBooleanAttribute'] === 'function'){
        let response = element['IsBooleanAttribute'](name);
        if (response === false || response === true){
            return response;
        }
    }

    return GetGlobal().GetConfig().IsBooleanAttribute(name);
}
