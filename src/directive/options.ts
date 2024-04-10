interface IResolveOptionsDetail<T>{
    options?: T;
    list?: Array<string>;
    option?: string;
    index?: number;
}

interface IResolveOptionsParams<T>{
    options: T;
    list: Array<string>;
    defaultNumber?: number | ((option: string) => number);
    callback?: (details: IResolveOptionsDetail<T>) => void | boolean;
    unknownCallback?: (details: IResolveOptionsDetail<T>) => void;
}

export function ExtractDuration(value: string, defaultValue = 0){
    const regex = /^[0-9]+(s|ms)?$/;
    if (!value || !value.match(regex)){
        return defaultValue;
    }

    if (value.indexOf('m') == -1 && value.indexOf('s') != -1){//Seconds
        return (parseInt(value) * 1000);
    }

    return parseInt(value);
}

export function ResolveOptions<T>({ options, list, defaultNumber, callback, unknownCallback }: IResolveOptionsParams<T>){
    const resolvedOptions = (Array.isArray(options) ? options : [options]);
    const getDefaultNumber = (opt: string) => (((typeof defaultNumber === 'number') ? defaultNumber : (defaultNumber && defaultNumber(opt))) || 0);

    list.forEach((option, index) => {
        const matched = resolvedOptions.find(opt => (opt && option in opt));
        if (!matched){//Not found
            return (unknownCallback && unknownCallback({ options, list, option, index }));
        }
        
        if ((!callback || callback({ options, list, option, index }) !== true)){
            if (typeof matched[option] === 'number'){
                if (index < (list.length - 1)){
                    matched[option] = ExtractDuration(list[index + 1].trim(), getDefaultNumber(option));
                }
                else{
                    matched[option] = getDefaultNumber(option);
                }
            }
            else if (typeof matched[option] === 'boolean'){
                matched[option] = true;
            }
        }
    });

    return options;
}
