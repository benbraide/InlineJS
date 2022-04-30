import { EvaluateLater } from "../evaluator/evaluate-later";
import { StreamData } from "../evaluator/stream-data";
import { UseEffect } from "../reactive/effect";
import { IsObject } from "../utilities/is-object";

export interface IKeyValueParams{
    componentId: string;
    contextElement: HTMLElement;
    key: string;
    expression: string;
    callback: (info: [string, any]) => void;
    arrayCallback?: (list: Array<any>) => void;
    useEffect?: boolean;
}

export function ResolveKeyValue({ componentId, contextElement, key, expression, callback, arrayCallback, useEffect = true }: IKeyValueParams){
    let checkpoint = 0, evaluate = EvaluateLater({ componentId, contextElement, expression }), resolve = (value: any, myCheckpoint: number) => {
        StreamData(value, (value) => {
            if (myCheckpoint != checkpoint){
                return;
            }
            
            if (key){
                callback([key, value]);
            }
            else if (IsObject(value)){
                Object.entries(value).forEach(callback);
            }
            else if (arrayCallback && (typeof value === 'string' || Array.isArray(value))){
                arrayCallback((typeof value === 'string') ? value.trim().split(' ').filter(item => !!item) : value);
            }
        });
    };

    if (useEffect){
        UseEffect({ componentId, contextElement,
            callback: () => evaluate(value => resolve(value, ++checkpoint)),
        });
    }
    else{//No effect
        evaluate(value => resolve(value, checkpoint));
    }
}
