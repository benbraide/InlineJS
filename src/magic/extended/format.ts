import { FindComponentById } from "../../component/find";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { InitJITProxy } from "../../proxy/jit";
import { ToString } from "../../utilities/to-string";
import { Nothing } from "../../values/nothing";

export const FormatMagicHandler = CreateMagicHandlerCallback('format', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('format', (component || FindComponentById(componentId)), contextElement);
    if (!elementKey || proxy){//Invalid context element OR proxy already exists
        return proxy;
    }

    let queueCheckpoint = 0, formatters = {
        nextTick: (data: any) => {
            let checkpoint = ++queueCheckpoint;
            return new Promise((resolve) => FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => {
                if (data instanceof Promise){
                    data.then((value) => resolve((checkpoint === queueCheckpoint) ? value : new Nothing));
                }
                else{//Resolve
                    resolve((checkpoint === queueCheckpoint) ? data : new Nothing);
                }
            }));
        },
        comma: (data: any) => {
            let [beforePoint, afterPoint = ''] = ToString(data).split('.');
            beforePoint = beforePoint.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return (afterPoint ? `${beforePoint}.${afterPoint}` : beforePoint);
        },
        prefix: (data: any, value: any) => (ToString(value) + ToString(data)),
        suffix: (data: any, value: any) => (ToString(data) + ToString(value)),
        round: (data: any, dp?: number) => ((typeof data === 'number') ? (Math.round(data * 100) / 100).toFixed(dp || 0) : ToString(data)),
    };
    
    return (scope![elementKey] = CreateReadonlyProxy(formatters));
});

export function FormatMagicHandlerCompact(){
    AddMagicHandler(FormatMagicHandler);
}
