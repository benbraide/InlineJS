"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionDirectiveHandlerCompact = exports.TransitionDirectiveHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
const get_1 = require("../../../global/get");
const effect_1 = require("../../../reactive/effect");
const event_1 = require("../../event");
const transition_1 = require("../../transition");
function HandleNumeric({ data, key, defaultValue, componentId, contextElement, expression }) {
    if ((0, get_1.GetGlobal)().IsNothing(data)) {
        return;
    }
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true }), update = (value) => {
        data[key] = (((typeof value === 'number') && value) || defaultValue);
    };
    (0, effect_1.UseEffect)({ componentId, contextElement,
        callback: () => evaluate(update),
    });
}
exports.TransitionDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('transition', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b, _c, _d;
    if ((0, event_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: 'transition',
        event: argKey,
        defaultEvent: 'enter',
        eventWhitelist: ['leave', 'canceled'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })) {
        return;
    }
    let data = (_b = (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetData('transition');
    if (argKey === 'actor' && !(0, get_1.GetGlobal)().IsNothing(data)) {
        let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true }), updateActor = (value) => {
            var _a;
            if (typeof value === 'string') {
                data.actor = (((_a = (0, get_1.GetGlobal)().GetConcept('animation')) === null || _a === void 0 ? void 0 : _a.GetActorCollection().Find(value)) || null);
            }
            else {
                data.actor = (value || null);
            }
        };
        (0, effect_1.UseEffect)({ componentId, contextElement,
            callback: () => evaluate(updateActor),
        });
    }
    else if (argKey === 'ease' && !(0, get_1.GetGlobal)().IsNothing(data)) {
        let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression }), updateEase = (value) => {
            var _a;
            if (typeof value === 'string') {
                data.ease = (((_a = (0, get_1.GetGlobal)().GetConcept('animation')) === null || _a === void 0 ? void 0 : _a.GetEaseCollection().Find(value)) || null);
            }
            else {
                data.ease = (value || null);
            }
        };
        (0, effect_1.UseEffect)({ componentId, contextElement,
            callback: () => evaluate(updateEase),
        });
    }
    else if (argKey === 'duration') {
        HandleNumeric({ data, componentId, contextElement, expression, key: argKey, defaultValue: 300 });
    }
    else if (argKey === 'repeats' || argKey === 'delay') {
        HandleNumeric({ data, componentId, contextElement, expression, key: argKey, defaultValue: 0 });
    }
    else if (!data || (0, get_1.GetGlobal)().IsNothing(data)) {
        (_d = (_c = (component || (0, find_1.FindComponentById)(componentId))) === null || _c === void 0 ? void 0 : _c.FindElementScope(contextElement)) === null || _d === void 0 ? void 0 : _d.SetData('transition', {
            actor: null,
            ease: null,
            duration: transition_1.DefaultTransitionDuration,
            repeats: transition_1.DefaultTransitionRepeats,
            delay: transition_1.DefaultTransitionDelay,
            allowed: (!argOptions.includes('normal') ? (argOptions.includes('reversed') ? 'reversed' : 'both') : 'normal'),
        });
    }
});
function TransitionDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.TransitionDirectiveHandler);
}
exports.TransitionDirectiveHandlerCompact = TransitionDirectiveHandlerCompact;
