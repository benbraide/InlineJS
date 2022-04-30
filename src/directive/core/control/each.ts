import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { StreamData } from "../../../evaluator/stream-data";
import { JournalTry } from "../../../journal/try";
import { AddChanges } from "../../../proxy/add-changes";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../../proxy/create";
import { IComponent } from "../../../types/component";
import { GetTarget } from "../../../utilities/get-target";
import { IsObject } from "../../../utilities/is-object";
import { ToString } from "../../../utilities/to-string";
import { Future } from "../../../values/future";
import { GetDirectiveValue } from "../../get-value";
import { ProcessDirectives } from "../../process";
import { InitControl } from "./init";
import { InsertControlClone } from "./insert";

type ListType<T> = Record<string, T> | Array<T>;

interface IProxyInfo{
    proxy: object;
    refresh: (entries: Record<string, any>) => void;
}

export const EachDirectiveHandler = CreateDirectiveHandlerCallback('each', ({ componentId, component, contextElement, expression, ...rest }) => {
    expression = expression.trim();// list as value || list as key => value
    let [_, matchedExpression, keyName, __, valueName] = (expression.match(/^(.+)?\s+as\s+([A-Za-z_$][0-9A-Za-z_$]*)(\s*=>\s*([A-Za-z_$][0-9A-Za-z_$]*))?$/) || []);
    matchedExpression = (matchedExpression || expression);//Use expression if no match
    if (!valueName){
        valueName = keyName;
        keyName = '';
    }
    
    let init = InitControl({ componentId, component, contextElement, expression: matchedExpression, ...rest });
    if (!init){//Failed to initialize
        return;
    }

    let key = (((component || FindComponentById(componentId))?.FindElementScope(contextElement)?.GetKey()) || null);
    if (!key){//Check if attribute is present
        key = GetDirectiveValue(contextElement, 'key', ':key');
    }
    
    let evaluateKey = (key ? EvaluateLater({ componentId, contextElement, expression: key }) : null), getKey = (index: number, list: Array<any>) => {
        if (!evaluateKey){
            return '';
        }
        
        let component = FindComponentById(componentId), elementScope = component?.FindElementScope(contextElement), targetList = GetTarget(list);
        elementScope?.SetLocal('$each', { index,
            collection: targetList,
            count: (targetList as Array<any>).length,
            value: (targetList as Array<any>)[index],
            parent: component?.FindElementLocalValue(contextElement, '$each', true),
        });

        if (keyName){
            elementScope?.SetLocal(keyName, index);
        }

        if (valueName){
            elementScope?.SetLocal(valueName, (targetList as Array<any>)[index]);
        }

        let result = evaluateKey();
        elementScope?.DeleteLocal('$each');

        if (keyName){
            elementScope?.DeleteLocal(keyName);
        }

        if (valueName){
            elementScope?.DeleteLocal(valueName);
        }

        return result;
    };

    let getCount = (list: ListType<any>) => (Array.isArray(list) ? list.length : Object.keys(list).length);

    let createProxy = (component: IComponent, data: ListType<any>, value: any, index: number | string, parent: any): IProxyInfo => {
        let state = { collection: data, count: getCount(data), index, value, parent }, id = component.GenerateUniqueId('each_proxy_');
        return {
            proxy: CreateInplaceProxy(BuildGetterProxyOptions({ getter: (prop) => {
                if (prop && state.hasOwnProperty(prop)){
                    return state[prop];
                }
            }, lookup: [...Object.keys(state)], alert: { componentId, id } })),
            refresh: (entries: Record<string, any>) => {
                Object.entries(entries).forEach(([key, value]) => {
                    if (state.hasOwnProperty(key)){
                        state[key] = value;
                        AddChanges('set', `${id}.${key}`, key, component.GetBackend().changes);
                    }
                });
            },
        };
    };
    
    let list: ListType<HTMLElement> | null = null, proxies: ListType<IProxyInfo> | null = null;
    let insert = (data: ListType<any>, item: any, index: number | string, newList: ListType<HTMLElement>, key: string | null) => {
        let clone: HTMLElement | null = null;
        InsertControlClone({ componentId, contextElement,
            parent: init!.parent,
            clone: (clone = init!.clone()),
            relativeType: 'before',
            relative: contextElement,
            processDirectives: false,
        });

        let elementScope = component!.CreateElementScope(clone);
        let proxyInfo = createProxy(component!, data, item, index, component?.FindElementLocalValue(contextElement, '$each', true));
        
        if (Array.isArray(newList)){
            newList.push(clone);
            (proxies as Array<IProxyInfo>).push(proxyInfo);
        }
        else{
            newList[index] = clone;
            (proxies as Record<string, IProxyInfo>)[index] = proxyInfo;
        }

        if (key){
            clone.setAttribute('key', key);
        }
        
        elementScope?.SetLocal('$each', proxyInfo.proxy);
        if (keyName){
            elementScope?.SetLocal(keyName, new Future(() => proxyInfo.proxy['index']));
        }

        if (valueName){
            elementScope?.SetLocal(valueName, new Future(() => proxyInfo.proxy['value']));
        }

        ProcessDirectives({
            component: component!,
            element: clone,
            options: {
                checkDocument: false,
                checkTemplate: true,
            },
        });
    };

    let remove = (clone: HTMLElement) => {
        if (clone.parentElement){//Remove from DOM and destroy scope on next tick
            clone.remove();
            FindComponentById(componentId)?.FindElementScope(clone!)?.Destroy();
        }
    };

    let generateItems = (data: ListType<any>, callback: (inserter: (item: any, index: number | string) => void, cleanup: () => void) => void) => {
        let newList = (Array.isArray(data) ? new Array<HTMLElement>() : {}), oldProxies = proxies;

        list = ((Array.isArray(data) == Array.isArray(list)) ? list : null);
        proxies = (Array.isArray(data) ? new Array<IProxyInfo>() : {});
        
        callback((item, index) => {
            let elementWithKey: HTMLElement | null = null, key: string | null = null;
            if (Array.isArray(data)){
                key = ToString(getKey(<number>index, data));
                elementWithKey = ((<Array<HTMLElement>>list || []).find(el => (el.getAttribute('key') === key)) || null);
            }
            else{
                elementWithKey = ((list && index in list) ? list[index] : null);
            }
            
            if (elementWithKey){//Reuse element
                let proxy = oldProxies![index];
                if (Array.isArray(newList)){
                    newList.push(elementWithKey);
                    (proxies as Array<IProxyInfo>).push(proxy);
                }
                else{
                    newList[index] = elementWithKey;
                    (proxies as Record<string, IProxyInfo>)[index] = proxy;
                }

                elementWithKey.parentElement!.insertBefore(elementWithKey, contextElement);//Move to update position
                proxy.refresh({ data, item, index, count: data.length });
            }
            else{//Create new
                insert(data, item, index, newList, key);
            }
        }, () => {//Sync lists
            if (list && Array.isArray(list)){
                (list as Array<HTMLElement>).filter(el => !(newList as Array<HTMLElement>).includes(el)).forEach(remove);
            }
            else if (list){
                Object.entries(list).filter(([key]) => !(key in newList)).forEach(([key, el]) => remove(el));
            }
    
            list = newList;
        });
    };
    
    let generateArrayItems = (data: Array<any>) => generateItems(data, (inserter, cleanup) => {
        data.forEach(inserter);
        cleanup();
    });

    let generateMapItems = (data: Record<string, any>) => generateItems(data, (inserter, cleanup) => {
        Object.entries(data).forEach(([key, value]) => inserter(value, key));
        cleanup();
    });

    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => generateArrayItems([]));

    let firstEntry = true;
    init.effect((value) => {//Prevent adding 'get access' entries
        let checkpoint = ++init!.checkpoint, component = (firstEntry ? FindComponentById(componentId) : null); component?.GetBackend().changes.PushGetAccessStorageSnapshot();
        StreamData(value, (value) => {
            if (checkpoint != init?.checkpoint){
                return;
            }

            JournalTry(() => {
                if (Array.isArray(value)){
                    generateArrayItems(value);
                }
                else if (typeof value === 'number'){
                    generateArrayItems((value < 0) ? Array.from(Array(-value).keys()).map(item => -(item + 1)) : Array.from(Array(value).keys()));
                }
                else if (IsObject(value)){
                    generateMapItems(value);
                }
            }), 'InlineJS.EachDirectiveHandler.Effect', contextElement;
        });

        component?.GetBackend().changes.PopGetAccessStorageSnapshot(false);
        firstEntry = false;
    });
});

export function EachDirectiveHandlerCompact(){
    AddDirectiveHandler(EachDirectiveHandler);
}
