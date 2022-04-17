import { ToString } from "../utilities/to-string";
import { Nothing } from "../values/nothing";

export function GetData(data: any, callback: (value: any) => void){
    if (data instanceof Promise){
        data.then(value => callback((value instanceof Nothing) ? '' : ToString(value)));
    }
    else{//Immediate
        callback(data);
    }
}
