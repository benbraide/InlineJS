import { FindComponentById } from "../../component/find";
import { StreamData } from "../../evaluator/stream-data";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { InitJITProxy } from "../../proxy/jit";
import { IsObject } from "../../utilities/is-object";
import { ToString } from "../../utilities/to-string";

export const FormatMagicHandler = CreateMagicHandlerCallback('format', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('format', (component || FindComponentById(componentId)), contextElement);
    if (!elementKey || proxy){//Invalid context element OR proxy already exists
        return proxy;
    }

    let affix = (data: any, value: any, callback: (data: string, value: string) => string) => {
        return StreamData(data, (data) => {
            return StreamData(value, value => callback(data, value));
        });
    };

    let queueCheckpoint = 0, formatters = {
        nextTick: (data: any) => {
            let checkpoint = ++queueCheckpoint;
            return new Promise((resolve) => FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => {
                if (data instanceof Promise){
                    data.then((value) => resolve((checkpoint === queueCheckpoint) ? value : GetGlobal().CreateNothing()));
                }
                else{//Resolve
                    resolve((checkpoint === queueCheckpoint) ? data : GetGlobal().CreateNothing());
                }
            }));
        },
        comma: (data: any) => StreamData(data, (data) => {
            let [beforePoint, afterPoint = ''] = ToString(data).split('.');
            beforePoint = beforePoint.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return (afterPoint ? `${beforePoint}.${afterPoint}` : beforePoint);
        }),
        prefix: (data: any, value: any) => affix(data, value, (data, value) => (value + data)),
        suffix: (data: any, value: any) => affix(data, value, (data, value) => (data + value)),
        affix: (data: any, prefix: any, suffix: any) => affix(data, prefix, (data, value) => affix((value + data), suffix, (data, value) => (data + value))),
        round: (data: any, dp?: number) => StreamData(data, (data) => {
            let parsed = parseFloat(ToString(data));
            return (((parsed || parsed === 0) ? (Math.round(parsed * 100) / 100).toFixed(dp || 0).toString() : parsed));
        }),
        map: (data: any, keys: string | number | Array<string | number>) => StreamData(data, (data) => {
            if (Array.isArray(data)){
                return (Array.isArray(keys) ? data.filter((v, index) => keys.includes(index)) : data.at((typeof keys === 'string') ? parseInt(keys) : keys));
            }

            if (IsObject(data)){
                if (!Array.isArray(keys)){
                    return data[keys.toString()];
                }

                let mapped = {};
                Object.entries(data).forEach(([key, value]) => {
                    if (keys.includes(key)){
                        mapped[key] = value;
                    }
                });

                return mapped;
            }

            return data;
        }),
    };
    
    return (scope![elementKey] = CreateReadonlyProxy(formatters));
});

export function FormatMagicHandlerCompact(){
    AddMagicHandler(FormatMagicHandler);
}
