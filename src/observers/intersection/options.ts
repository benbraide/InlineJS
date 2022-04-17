import { IsObject } from "../../utilities/is-object";

export function BuildIntersectionOptions(data: any){
    let options: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
    };

    if (IsObject(data)){//Overwrite applicable options
        Object.entries(options).forEach(([key, value]) => (options[key] = ((key in data && data[key]) || value)));
    }

    return options;
}
