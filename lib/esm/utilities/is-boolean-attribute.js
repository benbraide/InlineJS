import { GetGlobal } from "../global/get";
export function IsBooleanAttribute(element, name) {
    if (element.hasOwnProperty('IsBooleanAttribute') && typeof element['IsBooleanAttribute'] === 'function') {
        let response = element['IsBooleanAttribute'](name);
        if (response === false || response === true) {
            return response;
        }
    }
    return GetGlobal().GetConfig().IsBooleanAttribute(name);
}
