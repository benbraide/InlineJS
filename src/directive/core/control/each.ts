import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { StreamData } from "../../../evaluator/stream-data";
import { GetGlobal } from "../../../global/get";
import { JournalTry } from "../../../journal/try";
import { AddChanges } from "../../../proxy/add-changes";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../../proxy/create";
import { IComponent } from "../../../types/component";
import { GetTarget } from "../../../utilities/get-target";
import { IsEqual } from "../../../utilities/is-equal";
import { IsObject } from "../../../utilities/is-object";
import { ToString } from "../../../utilities/to-string";
import { GetDirectiveValue } from "../../get-value";
import { ProcessDirectives } from "../../process";
import { TransitionCheck } from "../../transition";
import { InitControl } from "./init";
import { InsertControlClone } from "./insert";

type ListType<T> = Record<string, T> | Array<T>;

interface IProxyInfo{
    proxy: object;
    refresh: (entries: Record<string, any>) => void;
}

interface IEntryInfo{
    item: HTMLElement;
    proxyInfo: IProxyInfo;
    transitionCancel: (() => void) | null;
    checkpoint: number;
}

export const EachDirectiveHandler = CreateDirectiveHandlerCallback('each', ({ componentId, component, contextElement, expression, ...rest }) => {
    expression = expression.trim();// list as value || list as key => value
    let [_, matchedExpression, keyName, __, valueName] = (expression.match(/^(.+?)?\s+as\s+([A-Za-z_$][0-9A-Za-z_$]*)(\s*=>\s*([A-Za-z_$][0-9A-Za-z_$]*))?$/) || []);
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
                    FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                    return state[prop];
                }
            }, lookup: [...Object.keys(state)], alert: { componentId, id } })),
            refresh: (entries: Record<string, any>) => {
                Object.entries(entries).forEach(([key, value]) => {
                    if (state.hasOwnProperty(key) && !IsEqual(state[key], value)){
                        state[key] = value;
                        AddChanges('set', `${id}.${key}`, key, FindComponentById(componentId)?.GetBackend().changes);
                    }
                });
            },
        };
    };
    
    let list: ListType<IEntryInfo> | null = null;
    let insert = (data: ListType<any>, item: any, index: number | string, newList: ListType<IEntryInfo>, key: string | null) => {
        let clone: HTMLElement | null = null, component = FindComponentById(componentId);
        if (!component){
            return;
        }
        
        InsertControlClone({ componentId, contextElement,
            parent: init!.parent,
            clone: (clone = init!.clone()),
            relativeType: 'before',
            relative: contextElement,
            processDirectives: false,
        });

        let elementScope = component!.CreateElementScope(clone);
        let proxyInfo = createProxy(component!, data, item, index, component?.FindElementLocalValue(contextElement, '$each', true));
        
        let entryInfo: IEntryInfo = { proxyInfo,
            item: clone,
            transitionCancel: null,
            checkpoint: 0,
        };
        
        Array.isArray(newList) ? newList.push(entryInfo) : (newList[index] = entryInfo);
        if (key){
            clone.setAttribute('key', key);
        }
        
        elementScope?.SetLocal('$each', proxyInfo.proxy);
        if (keyName){
            elementScope?.SetLocal(keyName, GetGlobal().CreateFuture(() => proxyInfo.proxy['index']));
        }

        if (valueName){
            elementScope?.SetLocal(valueName, GetGlobal().CreateFuture(() => proxyInfo.proxy['value']));
        }

        ProcessDirectives({
            component: component!,
            element: clone,
            options: {
                checkDocument: false,
                checkTemplate: true,
            },
        });

        entryInfo.checkpoint += 1;
        entryInfo.transitionCancel && entryInfo.transitionCancel();

        let myCheckpoint = ++entryInfo.checkpoint;
        entryInfo.transitionCancel = TransitionCheck({ componentId, contextElement,
            target: clone,
            callback: () => {
                if (myCheckpoint == entryInfo.checkpoint){
                    entryInfo.transitionCancel = null;
                }
            },
            reverse: false,
        });
    };

    let remove = (info: IEntryInfo) => {
        let myCheckpoint = ++info.checkpoint;
        
        info.transitionCancel && info.transitionCancel();
        info.transitionCancel = TransitionCheck({ componentId, contextElement,
            target: info.item,
            callback: () => {
                if (myCheckpoint == info.checkpoint){
                    info.transitionCancel = null;
                    if (info.item.parentElement){
                        info.item.remove();
                        FindComponentById(componentId)?.FindElementScope(info.item!)?.Destroy();
                    }
                }
            },
            reverse: true,
        });
    };

    let generateItems = (data: ListType<any>, callback: (inserter: (item: any, index: number | string) => void, cleanup: () => void) => void) => {
        let newList = (Array.isArray(data) ? new Array<IEntryInfo>() : {}), oldList = list;

        list = ((Array.isArray(data) == Array.isArray(list)) ? list : null);
        callback((item, index) => {
            let infoWithKey: IEntryInfo | null = null, key: string | null = null;
            if (Array.isArray(data)){
                key = ToString(getKey(<number>index, data));
                infoWithKey = ((list && key && (list as Array<IEntryInfo>).find(({ item }) => (item.getAttribute('key') === key))) || null);
            }
            else if (list && list.hasOwnProperty(index)){
                infoWithKey = list[index];
            }
            
            if (infoWithKey){//Reuse element
                Array.isArray(newList) ? newList.push(infoWithKey) : (newList[index] = infoWithKey);
                infoWithKey.item.parentElement!.insertBefore(infoWithKey.item, contextElement);//Move to update position
                infoWithKey.proxyInfo.refresh({ collection: data, value: item, index, count: getCount(data) });
            }
            else{//Create new
                insert(data, item, index, newList, key);
            }
        }, () => {//Sync lists
            if (Array.isArray(oldList)){
                (oldList as Array<IEntryInfo>).filter(info => !(newList as Array<IEntryInfo>).includes(info)).forEach(remove);
            }
            else if (list){
                Object.entries(oldList as Record<string, IEntryInfo>).filter(([key]) => !(key in newList)).forEach(([key, info]) => remove(info));
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
