interface IResolveOptionsDetail<T>{
    options?: T;
    list?: Array<string>;
    option?: string;
    index?: number;
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

export function ResolveOptions<T>(options: T, list: Array<string>, defaultNumber = 0, callback?: (details?: IResolveOptionsDetail<T>) => void | boolean){
    list.forEach((option, index) => {
        if ((!callback || callback({ options, list, option, index }) !== true) && option in options){
            if (typeof options[option] === 'number'){
                if (index < (list.length - 1)){
                    options[option] = ExtractDuration(list[index + 1].trim(), defaultNumber);
                }
                else{
                    options[option] = defaultNumber;
                }
            }
            else if (typeof options[option] === 'boolean'){
                options[option] = true;
            }
        }
    });

    return options;
}
