"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnbindOutsideEvent = exports.AddOutsideEventExcept = exports.RemoveOutsideEventListener = exports.AddOutsideEventListener = void 0;
const try_1 = require("../journal/try");
const InlineJS_OutsideEvent_Key = 'InlineJS_OutsideEvent';
function GetOutsideEventGlobalBlock() {
    return (globalThis[InlineJS_OutsideEvent_Key] = (globalThis[InlineJS_OutsideEvent_Key] || {
        targetScopes: new Array(),
        eventCallbacks: {},
    }));
}
function AddOutsideEventListener(target, events, handler) {
    let block = GetOutsideEventGlobalBlock(), targetScope = block.targetScopes.find(scope => (scope.target === target));
    if (!targetScope) { //Add new entry
        targetScope = {
            target: target,
            listeners: {},
        };
        block.targetScopes.push(targetScope);
    }
    (Array.isArray(events) ? events : [events]).forEach((event) => {
        if (!(event in targetScope.listeners)) { //Add new entry
            targetScope.listeners[event] = {
                handlers: new Array(),
                excepts: null,
            };
        }
        targetScope.listeners[event].handlers.push({
            callback: handler,
            excepts: null,
        });
        if (!(event in block.eventCallbacks)) { //Bind
            block.eventCallbacks[event] = (e) => {
                block.targetScopes.forEach((scope) => {
                    if (!(e.type in scope.listeners) || scope.target === e.target || scope.target.contains(e.target)) {
                        return; //Not listening to raised event OR event occured inside target
                    }
                    if ((scope.listeners[e.type].excepts || []).findIndex(except => (except === e.target || except.contains(e.target))) != -1) {
                        return; //Event target was registered as an exception
                    }
                    scope.listeners[e.type].handlers
                        .filter(info => ((info.excepts || []).findIndex(except => (except === e.target || except.contains(e.target))) == -1))
                        .forEach(info => (0, try_1.JournalTry)(() => info.callback(e), 'InlineJS.OutsideEventListener'));
                });
            };
            window.addEventListener(event, block.eventCallbacks[event]);
        }
    });
}
exports.AddOutsideEventListener = AddOutsideEventListener;
function RemoveOutsideEventListener(target, events, handler) {
    const block = GetOutsideEventGlobalBlock();
    const targetScope = block.targetScopes.find(scope => (scope.target === target));
    if (!targetScope) {
        return;
    }
    (Array.isArray(events) ? events : [events]).forEach((event) => {
        if (event in targetScope.listeners) {
            if (handler) {
                targetScope.listeners[event].handlers = targetScope.listeners[event].handlers.filter(info => (info.callback !== handler));
                if (targetScope.listeners[event].handlers.length === 0) {
                    delete targetScope.listeners[event];
                }
            }
            else { //Remove all
                delete targetScope.listeners[event];
            }
        }
        // If no more scopes are listening for this event, remove the global listener
        if (event in block.eventCallbacks && !block.targetScopes.some(scope => event in scope.listeners)) {
            window.removeEventListener(event, block.eventCallbacks[event]);
            delete block.eventCallbacks[event];
        }
    });
}
exports.RemoveOutsideEventListener = RemoveOutsideEventListener;
function AddOutsideEventExcept(target, list, handler) {
    const targetScope = GetOutsideEventGlobalBlock().targetScopes.find(scope => (scope.target === target));
    if (!targetScope) {
        return;
    }
    Object.entries(list).forEach(([event, exceptsToAdd]) => {
        const listenerInfo = targetScope.listeners[event];
        if (!listenerInfo) {
            return;
        }
        const excepts = Array.isArray(exceptsToAdd) ? exceptsToAdd : [exceptsToAdd];
        if (handler) {
            const handlerInfo = listenerInfo.handlers.find(item => (item.callback === handler));
            if (handlerInfo) {
                handlerInfo.excepts = (handlerInfo.excepts || []);
                handlerInfo.excepts.push(...excepts);
            }
        }
        else { //General
            listenerInfo.excepts = (listenerInfo.excepts || []);
            listenerInfo.excepts.push(...excepts);
        }
    });
}
exports.AddOutsideEventExcept = AddOutsideEventExcept;
function UnbindOutsideEvent(target) {
    const block = GetOutsideEventGlobalBlock();
    const oldScopes = block.targetScopes;
    block.targetScopes = block.targetScopes.filter(scope => (scope.target !== target && !target.contains(scope.target)));
    if (oldScopes.length === block.targetScopes.length) {
        return; // No scopes were removed
    }
    // A scope is removed, check for orphaned window events
    Object.keys(block.eventCallbacks).forEach(event => {
        if (!block.targetScopes.some(scope => event in scope.listeners)) {
            window.removeEventListener(event, block.eventCallbacks[event]);
            delete block.eventCallbacks[event];
        }
    });
}
exports.UnbindOutsideEvent = UnbindOutsideEvent;
