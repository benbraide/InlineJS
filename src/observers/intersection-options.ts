import { IsObject } from "../utilities/is-object";

export interface IIntersectionOptions extends IntersectionObserverInit{
    spread?: boolean;
}

const IntersectionThresholds = Array.from(Array(100).keys()).map(i => (i / 100));

export function BuildIntersectionOptions(data: IIntersectionOptions){
    let options: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
    };

    if (IsObject(data)){//Overwrite applicable options
        Object.entries(options).forEach(([key, value]) => (options[key] = ((key in data && data[key]) || value)));
    }

    if (data.spread){
        options.threshold = IntersectionThresholds;
    }

    return options;
}
