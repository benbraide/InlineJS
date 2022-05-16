"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSelectionDirectiveHandler = void 0;
const find_1 = require("../../../component/find");
const callback_1 = require("../../../directives/callback");
const stream_data_1 = require("../../../evaluator/stream-data");
const error_1 = require("../../../journal/error");
const transition_1 = require("../../transition");
const init_1 = require("./init");
const insert_1 = require("./insert");
function CreateSelectionDirectiveHandler(isElse) {
    return (0, callback_1.CreateDirectiveHandlerCallback)((isElse ? 'else' : 'if'), (_a) => {
        var _b;
        var { componentId, component, contextElement, expression } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "expression"]);
        let resolvedComponent = (component || (0, find_1.FindComponentById)(componentId)), selectionScopeStackEntry = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.PeekSelectionScope();
        if (isElse && (!(selectionScopeStackEntry === null || selectionScopeStackEntry === void 0 ? void 0 : selectionScopeStackEntry.scope) || !(selectionScopeStackEntry === null || selectionScopeStackEntry === void 0 ? void 0 : selectionScopeStackEntry.set))) {
            return (0, error_1.JournalError)('Missing matching \'if\' statement.', 'ElseDirectiveHandler', contextElement);
        }
        expression = expression.trim();
        let lastValue = false, lastEffectValue = null, lastState = (isElse && !!((_b = selectionScopeStackEntry === null || selectionScopeStackEntry === void 0 ? void 0 : selectionScopeStackEntry.scope) === null || _b === void 0 ? void 0 : _b.state));
        let firstEntry = true, init = (0, init_1.InitControl)(Object.assign({ componentId, component, contextElement, expression }, rest));
        if (!init) { //Failed to initialize
            return;
        }
        if (!expression && isElse) { //Evaluates to true
            init.effect = handler => handler(true);
        }
        let clone = null, insert = () => (0, insert_1.InsertControlClone)({ componentId, contextElement,
            parent: init.parent,
            clone: (clone = init.clone()),
            relativeType: 'before',
            relative: contextElement, });
        let remove = () => {
            var _a;
            if (clone && clone.parentElement) { //Remove from DOM and destroy scope on next tick
                let cloneCopy = clone;
                clone.remove();
                clone = null;
                (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => {
                    var _a, _b;
                    (_b = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(cloneCopy)) === null || _b === void 0 ? void 0 : _b.Destroy();
                    cloneCopy = null;
                });
            }
        };
        let checkpoint = 0, transitionCancel = null, effect = (value) => {
            let pred = (!!value && !lastState);
            if ((firstEntry && pred) || (pred !== lastValue)) { //Apply applicable transitions if not first entry or value is truthy
                let myCheckpoint = ++checkpoint;
                transitionCancel && transitionCancel();
                !!pred && insert();
                transitionCancel = (0, transition_1.WaitTransition)({ componentId, contextElement,
                    target: (clone || undefined),
                    callback: () => {
                        if (myCheckpoint == checkpoint) {
                            transitionCancel = null;
                            !pred && remove();
                        }
                    },
                    reverse: !pred,
                });
            }
            lastEffectValue = value;
            firstEntry = false;
            lastValue = pred;
            if (selectionScope) {
                selectionScope.state = (!!value || lastState);
                if (selectionScope.callback) {
                    selectionScope.callback(selectionScope.state);
                }
            }
        };
        let elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindElementScope(contextElement), selectionScope = null;
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(remove);
        if (selectionScopeStackEntry) {
            if (isElse) { //Listen for state change
                selectionScopeStackEntry.scope.callback = (state) => {
                    lastState = state;
                    effect(lastEffectValue);
                };
            }
            if (!isElse || expression) { //Create new scope
                selectionScopeStackEntry.scope = (selectionScope = {
                    state: lastState,
                });
                selectionScopeStackEntry.set = true;
            }
        }
        init.effect((value) => {
            let checkpoint = ++init.checkpoint;
            (0, stream_data_1.StreamData)(value, (value) => {
                if (checkpoint == (init === null || init === void 0 ? void 0 : init.checkpoint)) {
                    effect(value);
                }
            });
        });
    });
}
exports.CreateSelectionDirectiveHandler = CreateSelectionDirectiveHandler;
