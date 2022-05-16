import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { GetGlobal } from "../../../global/get";
import { UseEffect } from "../../../reactive/effect";
import { BindEvent } from "../../event";
import { DefaultTransitionDelay, DefaultTransitionDuration, DefaultTransitionRepeats } from "../../transition";
function HandleNumeric({ data, key, defaultValue, componentId, contextElement, expression }) {
    if (GetGlobal().IsNothing(data)) {
        return;
    }
    let evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true }), update = (value) => {
        data[key] = (((typeof value === 'number') && value) || defaultValue);
    };
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(update),
    });
}
export const TransitionDirectiveHandler = CreateDirectiveHandlerCallback('transition', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b, _c, _d;
    if (BindEvent({ contextElement, expression,
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
    let data = (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetData('transition');
    if (argKey === 'actor' && !GetGlobal().IsNothing(data)) {
        let evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true }), updateActor = (value) => {
            var _a;
            if (typeof value === 'string') {
                data.actor = (((_a = GetGlobal().GetConcept('animation')) === null || _a === void 0 ? void 0 : _a.GetActorCollection().Find(value)) || null);
            }
            else {
                data.actor = (value || null);
            }
        };
        UseEffect({ componentId, contextElement,
            callback: () => evaluate(updateActor),
        });
    }
    else if (argKey === 'ease' && !GetGlobal().IsNothing(data)) {
        let evaluate = EvaluateLater({ componentId, contextElement, expression }), updateEase = (value) => {
            var _a;
            if (typeof value === 'string') {
                data.ease = (((_a = GetGlobal().GetConcept('animation')) === null || _a === void 0 ? void 0 : _a.GetEaseCollection().Find(value)) || null);
            }
            else {
                data.ease = (value || null);
            }
        };
        UseEffect({ componentId, contextElement,
            callback: () => evaluate(updateEase),
        });
    }
    else if (argKey === 'duration') {
        HandleNumeric({ data, componentId, contextElement, expression, key: argKey, defaultValue: 300 });
    }
    else if (argKey === 'repeats' || argKey === 'delay') {
        HandleNumeric({ data, componentId, contextElement, expression, key: argKey, defaultValue: 0 });
    }
    else if (!data || GetGlobal().IsNothing(data)) {
        (_d = (_c = (component || FindComponentById(componentId))) === null || _c === void 0 ? void 0 : _c.FindElementScope(contextElement)) === null || _d === void 0 ? void 0 : _d.SetData('transition', {
            actor: null,
            ease: null,
            duration: DefaultTransitionDuration,
            repeats: DefaultTransitionRepeats,
            delay: DefaultTransitionDelay,
            allowed: (!argOptions.includes('normal') ? (argOptions.includes('reversed') ? 'reversed' : 'both') : 'normal'),
        });
    }
});
export function TransitionDirectiveHandlerCompact() {
    AddDirectiveHandler(TransitionDirectiveHandler);
}
