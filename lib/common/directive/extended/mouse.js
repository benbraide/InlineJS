"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseDirectiveHandlerCompact = exports.MouseDirectiveHandler = void 0;
const find_1 = require("../../component/find");
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
const evaluate_later_1 = require("../../evaluator/evaluate-later");
const options_1 = require("../options");
function BindMouseInside(contextElement, callback) {
    let lastValue = false, callCallback = (value) => {
        if (value != lastValue) {
            callback((lastValue = value), unbind);
        }
    };
    let onEnter = () => callCallback(true), onLeave = () => callCallback(false), unbind = () => {
        contextElement.removeEventListener('mouseleave', onLeave);
        contextElement.removeEventListener('mouseenter', onEnter);
    };
    contextElement.addEventListener('mouseenter', onEnter);
    contextElement.addEventListener('mouseleave', onLeave);
}
const DefaultMouseDelay = 100;
const DefaultMouseDebounce = 250;
function BindMouseRepeat(component, contextElement, delay, callback) {
    var _a;
    let checkpoint = 0, streak = 0, reset = () => {
        ++checkpoint;
        streak = 0;
    };
    (_a = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.AddUninitCallback(reset);
    let afterDelay = (myCheckpoint) => {
        if (myCheckpoint == checkpoint) {
            callback(++streak);
            setTimeout(() => afterDelay(myCheckpoint), ((delay < 0) ? DefaultMouseDelay : delay));
        }
    };
    contextElement.addEventListener('mousedown', () => {
        let myCheckpoint = ++checkpoint;
        callback(++streak);
        setTimeout(() => afterDelay(myCheckpoint), ((delay < 0) ? DefaultMouseDebounce : delay));
    });
    contextElement.addEventListener('mouseup', reset);
    contextElement.addEventListener('mouseenter', reset);
    contextElement.addEventListener('mouseleave', reset);
    contextElement.addEventListener('mouseover', reset);
    contextElement.addEventListener('mouseout', reset);
}
function BindMouseMove(contextElement, callback) {
    contextElement.addEventListener('mousemove', e => callback({
        client: { x: e.clientX, y: e.clientY },
        offset: { x: e.offsetX, y: e.offsetY },
        screen: { x: e.screenX, y: e.screenY },
    }));
    contextElement.addEventListener('mouseleave', () => callback(null));
}
exports.MouseDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('mouse', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    let options = (0, options_1.ResolveOptions)({
        options: {
            delay: -1,
            debounce: -1,
            once: false,
        },
        list: argOptions,
        defaultNumber: -1,
    });
    if (argKey === 'repeat') {
        let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression });
        return BindMouseRepeat((component || (0, find_1.FindComponentById)(componentId)), contextElement, options.delay, streak => evaluate(undefined, [streak], { streak }));
    }
    let assign = (value) => {
        (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement,
            expression: `(${expression}) = (${JSON.stringify(value)})`,
        })();
    };
    if (argKey === 'inside') {
        BindMouseInside(contextElement, (value, unbind) => {
            assign(value);
            if (options.once) {
                unbind();
            }
        });
    }
    else if (argKey === 'move') {
        BindMouseMove(contextElement, assign);
    }
});
function MouseDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.MouseDirectiveHandler);
}
exports.MouseDirectiveHandlerCompact = MouseDirectiveHandlerCompact;
