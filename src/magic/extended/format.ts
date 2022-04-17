import { FindComponentById } from "../../component/find";
import { WaitPromise } from "../../evaluator/wait-promise";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { CreateReadonlyProxy } from "../../proxy/create";
import { InitJITProxy } from "../../proxy/jit";
import { ToString } from "../../utilities/to-string";
import { Loop } from "../../values/loop";
import { Nothing } from "../../values/nothing";

export const FormatMagicHandler = CreateMagicHandlerCallback('format', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('format', (component || FindComponentById(componentId)), contextElement);
    if (!elementKey || proxy){//Invalid context element OR proxy already exists
        return proxy;
    }

    let wait = (target: any, callback: (data: any) => void) => WaitPromise(target, callback, true);
    let stream = (data: any, callback: (data: string) => any) => {
        if (data instanceof Loop){
            return new Loop((doWhile, doFinal) => {
                data.While((data) => {//For each iteration, wait if applicable, then do while
                    wait(data, (data) => {
                        wait(callback(ToString(data)), (value) => doWhile(ToString(value)));
                    });
                });

                data.Final((data) => {//For each iteration, wait if applicable, then do final
                    wait(data, (data) => {
                        wait(callback(ToString(data)), (value) => doFinal(ToString(value)));
                    });
                });
            });
        }

        if (data instanceof Promise){
            return new Promise<string>((resolve) => {
                wait(data, (data) => {
                    wait(callback(ToString(data)), (value) => resolve(ToString(value)));
                });
            });
        }

        return callback(ToString(data));
    };

    let affix = (data: any, value: any, callback: (data: string, value: string) => string) => {
        return stream(data, (data) => {
            return stream(value, value => callback(data, value));
        });
    };

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
        comma: (data: any) => stream(data, (data) => {
            let [beforePoint, afterPoint = ''] = data.split('.');
            beforePoint = beforePoint.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return (afterPoint ? `${beforePoint}.${afterPoint}` : beforePoint);
        }),
        prefix: (data: any, value: any) => affix(data, value, (data, value) => (value + data)),
        suffix: (data: any, value: any) => affix(data, value, (data, value) => (data + value)),
        round: (data: any, dp?: number) => stream(data, (data) => {
            let parsed = parseFloat(data);
            return (((parsed || parsed === 0) ? (Math.round(parsed * 100) / 100).toFixed(dp || 0).toString() : parsed));
        }),
    };
    
    return (scope![elementKey] = CreateReadonlyProxy(formatters));
});

export function FormatMagicHandlerCompact(){
    AddMagicHandler(FormatMagicHandler);
}
