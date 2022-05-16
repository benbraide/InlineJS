"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardDirectiveHandlerCompact = exports.KeyboardDirectiveHandler = void 0;
const find_1 = require("../../component/find");
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
const evaluate_later_1 = require("../../evaluator/evaluate-later");
const options_1 = require("../options");
function BindKeyboardInside(contextElement, callback) {
    let lastValue = false, callCallback = (value) => {
        if (value != lastValue) {
            callback((lastValue = value), unbind);
        }
    };
    let onEnter = () => callCallback(true), onLeave = () => callCallback(false), unbind = () => {
        contextElement.removeEventListener('focusout', onLeave);
        contextElement.removeEventListener('focusin', onEnter);
    };
    contextElement.addEventListener('focusin', onEnter);
    contextElement.addEventListener('focusout', onLeave);
}
function BindKeyboardKey(contextElement, key, callback) {
    let lastValue = '', callCallback = (value) => {
        if (value !== lastValue) {
            callback(lastValue = value);
        }
    };
    contextElement.addEventListener(`key${key}`, (e) => callCallback(e.key));
}
const DefaultKeyboardTypeDelay = 500;
function BindKeyboardType(component, contextElement, delay, callback) {
    var _a;
    let checkpoint = 0, reset = () => {
        ++checkpoint;
    };
    (_a = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.AddUninitCallback(reset);
    let lastValue = false, callCallback = (value) => {
        if (value != lastValue) {
            callback(lastValue = value);
        }
    };
    let afterDelay = (myCheckpoint) => {
        if (myCheckpoint == checkpoint) {
            callCallback(false);
        }
    };
    contextElement.addEventListener('keydown', () => {
        let myCheckpoint = ++checkpoint;
        callCallback(true);
        setTimeout(() => afterDelay(myCheckpoint), ((delay < 0) ? DefaultKeyboardTypeDelay : delay));
    });
}
exports.KeyboardDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('keyboard', ({ component, componentId, contextElement, expression, argKey, argOptions }) => {
    let options = (0, options_1.ResolveOptions)({
        options: {
            delay: -1,
            once: false,
        },
        list: argOptions,
        defaultNumber: -1,
    });
    let assign = (value) => {
        (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement,
            expression: `(${expression}) = (${JSON.stringify(value)})`,
        })();
    };
    if (argKey === 'inside') {
        BindKeyboardInside(contextElement, (value, unbind) => {
            assign(value);
            if (options.once) {
                unbind();
            }
        });
    }
    else if (argKey === 'down' || argKey === 'up') {
        BindKeyboardKey(contextElement, argKey, assign);
    }
    else if (argKey === 'type') {
        BindKeyboardType((component || (0, find_1.FindComponentById)(componentId)), contextElement, options.delay, assign);
    }
});
function KeyboardDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.KeyboardDirectiveHandler);
}
exports.KeyboardDirectiveHandlerCompact = KeyboardDirectiveHandlerCompact;
