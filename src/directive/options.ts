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
    const regex = /^[0-9\.]+(s|ms)?$/;
    if (!value || !value.match(regex)){
        return defaultValue;
    }

    if (value.indexOf('m') == -1 && value.indexOf('s') != -1){//Seconds
        return (parseFloat(value) * 1000);
    }

    return parseFloat(value);
}

export function ResolveOptions<T>({ options, list, defaultNumber, callback, unknownCallback }: IResolveOptionsParams<T>){
    const resolvedOptions = (Array.isArray(options) ? options : [options]);
    const getDefaultNumber = (opt: string) => (((typeof defaultNumber === 'number') ? defaultNumber : (defaultNumber && defaultNumber(opt))) || 0);

    for (let i = 0; i < list.length; ++i){
        const option = list[i];
        const matched = resolvedOptions.find(opt => (opt && option in opt));
        if (!matched){//Not found
            unknownCallback && unknownCallback({ options, list, option, index: i });
            continue;
        }
        
        if ((!callback || callback({ options, list, option, index: i }) !== true)){
            if (typeof matched[option] === 'number'){
                const next = ((i < (list.length - 1)) ? list[i + 1].trim() : '');
                if (next && /^[0-9]/.test(next)){//Value is specified
                    matched[option] = ExtractDuration(next, getDefaultNumber(option));
                    ++i;//Skip next entry
                }
                else{
                    matched[option] = getDefaultNumber(option);
                }
            }
            else if (typeof matched[option] === 'boolean'){
                matched[option] = true;
            }
        }
    }

    return options;
}
