var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { StreamData } from "../../../evaluator/stream-data";
import { GetGlobal } from "../../../global/get";
import { JournalTry } from "../../../journal/try";
import { AddChanges } from "../../../proxy/add-changes";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../../proxy/create";
import { GetTarget } from "../../../utilities/get-target";
import { IsEqual } from "../../../utilities/is-equal";
import { IsObject } from "../../../utilities/is-object";
import { ToString } from "../../../utilities/to-string";
import { GetDirectiveValue } from "../../get-value";
import { ProcessDirectives } from "../../process";
import { WaitTransition } from "../../transition";
import { InitControl } from "./init";
import { InsertControlClone } from "./insert";
export const EachDirectiveHandler = CreateDirectiveHandlerCallback('each', (_a) => {
    var _b, _c, _d, _e;
    var { componentId, component, contextElement, expression } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "expression"]);
    expression = expression.trim(); // list as value || list as key => value
    let [_, matchedExpression, keyName, __, valueName] = (expression.match(/^(.+?)?\s+as\s+([A-Za-z_$][0-9A-Za-z_$]*)(\s*=>\s*([A-Za-z_$][0-9A-Za-z_$]*))?$/) || []);
    matchedExpression = (matchedExpression || expression); //Use expression if no match
    if (!valueName) {
        valueName = keyName;
        keyName = '';
    }
    let init = InitControl(Object.assign({ componentId, component, contextElement, expression: matchedExpression }, rest));
    if (!init) { //Failed to initialize
        return;
    }
    let key = (((_c = (_b = (component || FindComponentById(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.GetKey()) || null);
    if (!key) { //Check if attribute is present
        key = GetDirectiveValue(contextElement, 'key', ':key');
    }
    let evaluateKey = (key ? EvaluateLater({ componentId, contextElement, expression: key }) : null), getKey = (index, list) => {
        if (!evaluateKey) {
            return '';
        }
        let component = FindComponentById(componentId), elementScope = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement), targetList = GetTarget(list);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$each', { index,
            collection: targetList,
            count: targetList.length,
            value: targetList[index],
            parent: component === null || component === void 0 ? void 0 : component.FindElementLocalValue(contextElement, '$each', true),
        });
        if (keyName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(keyName, index);
        }
        if (valueName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(valueName, targetList[index]);
        }
        let result = evaluateKey();
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.DeleteLocal('$each');
        if (keyName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.DeleteLocal(keyName);
        }
        if (valueName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.DeleteLocal(valueName);
        }
        return result;
    };
    let getCount = (list) => (Array.isArray(list) ? list.length : Object.keys(list).length);
    let createProxy = (component, data, value, index, parent) => {
        let state = { collection: data, count: getCount(data), index, value, parent }, id = component.GenerateUniqueId('each_proxy_');
        return {
            proxy: CreateInplaceProxy(BuildGetterProxyOptions({ getter: (prop) => {
                    var _a;
                    if (prop && state.hasOwnProperty(prop)) {
                        (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                        return state[prop];
                    }
                }, lookup: [...Object.keys(state)], alert: { componentId, id } })),
            refresh: (entries) => {
                Object.entries(entries).forEach(([key, value]) => {
                    var _a;
                    if (state.hasOwnProperty(key) && !IsEqual(state[key], value)) {
                        state[key] = value;
                        AddChanges('set', `${id}.${key}`, key, (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                    }
                });
            },
        };
    };
    let list = null;
    let insert = (data, item, index, newList, key) => {
        let clone = null, component = FindComponentById(componentId);
        if (!component) {
            return;
        }
        InsertControlClone({ componentId, contextElement,
            parent: init.parent,
            clone: (clone = init.clone()),
            relativeType: 'before',
            relative: contextElement,
            processDirectives: false, });
        let elementScope = component.CreateElementScope(clone);
        let proxyInfo = createProxy(component, data, item, index, component === null || component === void 0 ? void 0 : component.FindElementLocalValue(contextElement, '$each', true));
        let entryInfo = { proxyInfo,
            item: clone,
            transitionCancel: null,
            checkpoint: 0,
        };
        Array.isArray(newList) ? newList.push(entryInfo) : (newList[index] = entryInfo);
        if (key) {
            clone.setAttribute('key', key);
        }
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$each', proxyInfo.proxy);
        if (keyName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(keyName, GetGlobal().CreateFuture(() => proxyInfo.proxy['index']));
        }
        if (valueName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(valueName, GetGlobal().CreateFuture(() => proxyInfo.proxy['value']));
        }
        ProcessDirectives({
            component: component,
            element: clone,
            options: {
                checkDocument: false,
                checkTemplate: true,
            },
        });
        entryInfo.checkpoint += 1;
        entryInfo.transitionCancel && entryInfo.transitionCancel();
        let myCheckpoint = ++entryInfo.checkpoint;
        entryInfo.transitionCancel = WaitTransition({ componentId, contextElement,
            target: clone,
            callback: () => {
                if (myCheckpoint == entryInfo.checkpoint) {
                    entryInfo.transitionCancel = null;
                }
            },
            reverse: false,
        });
    };
    let remove = (info) => {
        let myCheckpoint = ++info.checkpoint;
        info.transitionCancel && info.transitionCancel();
        info.transitionCancel = WaitTransition({ componentId, contextElement,
            target: info.item,
            callback: () => {
                var _a, _b;
                if (myCheckpoint == info.checkpoint) {
                    info.transitionCancel = null;
                    if (info.item.parentElement) {
                        info.item.remove();
                        (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(info.item)) === null || _b === void 0 ? void 0 : _b.Destroy();
                    }
                }
            },
            reverse: true, });
    };
    let generateItems = (data, callback) => {
        let newList = (Array.isArray(data) ? new Array() : {}), oldList = list;
        list = ((Array.isArray(data) == Array.isArray(list)) ? list : null);
        callback((item, index) => {
            let infoWithKey = null, key = null;
            if (Array.isArray(data)) {
                key = ToString(getKey(index, data));
                infoWithKey = ((list && key && list.find(({ item }) => (item.getAttribute('key') === key))) || null);
            }
            else if (list && list.hasOwnProperty(index)) {
                infoWithKey = list[index];
            }
            if (infoWithKey) { //Reuse element
                Array.isArray(newList) ? newList.push(infoWithKey) : (newList[index] = infoWithKey);
                infoWithKey.item.parentElement.insertBefore(infoWithKey.item, contextElement); //Move to update position
                infoWithKey.proxyInfo.refresh({ collection: data, value: item, index, count: getCount(data) });
            }
            else { //Create new
                insert(data, item, index, newList, key);
            }
        }, () => {
            if (Array.isArray(oldList)) {
                oldList.filter(info => !newList.includes(info)).forEach(remove);
            }
            else if (list) {
                Object.entries(oldList).filter(([key]) => !(key in newList)).forEach(([key, info]) => remove(info));
            }
            list = newList;
        });
    };
    let generateArrayItems = (data) => generateItems(data, (inserter, cleanup) => {
        data.forEach(inserter);
        cleanup();
    });
    let generateMapItems = (data) => generateItems(data, (inserter, cleanup) => {
        Object.entries(data).forEach(([key, value]) => inserter(value, key));
        cleanup();
    });
    (_e = (_d = (component || FindComponentById(componentId))) === null || _d === void 0 ? void 0 : _d.FindElementScope(contextElement)) === null || _e === void 0 ? void 0 : _e.AddUninitCallback(() => generateArrayItems([]));
    let firstEntry = true;
    init.effect((value) => {
        let checkpoint = ++init.checkpoint, component = (firstEntry ? FindComponentById(componentId) : null);
        component === null || component === void 0 ? void 0 : component.GetBackend().changes.PushGetAccessStorageSnapshot();
        StreamData(value, (value) => {
            if (checkpoint != (init === null || init === void 0 ? void 0 : init.checkpoint)) {
                return;
            }
            JournalTry(() => {
                if (Array.isArray(value)) {
                    generateArrayItems(value);
                }
                else if (typeof value === 'number') {
                    generateArrayItems((value < 0) ? Array.from(Array(-value).keys()).map(item => -(item + 1)) : Array.from(Array(value).keys()));
                }
                else if (IsObject(value)) {
                    generateMapItems(value);
                }
            }), 'InlineJS.EachDirectiveHandler.Effect', contextElement;
        });
        component === null || component === void 0 ? void 0 : component.GetBackend().changes.PopGetAccessStorageSnapshot(false);
        firstEntry = false;
    });
});
export function EachDirectiveHandlerCompact() {
    AddDirectiveHandler(EachDirectiveHandler);
}
