"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyCheck = void 0;
const find_1 = require("../component/find");
const evaluate_later_1 = require("../evaluator/evaluate-later");
const wait_promise_1 = require("../evaluator/wait-promise");
const intersection_1 = require("../observers/intersection");
const effect_1 = require("../reactive/effect");
const options_1 = require("./options");
function LazyCheck({ componentId, component, contextElement, expression, argOptions, callback, options, defaultOptionValue, useEffect }) {
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression }), resolvedOptions = (0, options_1.ResolveOptions)({
        options: (options || {
            lazy: false,
            ancestor: -1,
            threshold: -1,
        }),
        list: argOptions,
        defaultNumber: ((defaultOptionValue === 0) ? 0 : (defaultOptionValue || -1)),
    });
    let doEvaluation = () => evaluate(data => (0, wait_promise_1.WaitPromise)(data, callback)), effect = () => ((useEffect === false) ? doEvaluation() : (0, effect_1.UseEffect)({ componentId, contextElement,
        callback: doEvaluation,
    }));
    if (resolvedOptions.lazy) { //Wait until element is visible
        let resolvedComponent = (component || (0, find_1.FindComponentById)(componentId)), intersectionOptions = {
            root: ((resolvedOptions.ancestor < 0) ? null : resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindAncestor(contextElement, resolvedOptions.ancestor)),
            threshold: ((resolvedOptions.threshold < 0) ? 0 : resolvedOptions.threshold),
        };
        let observer = (resolvedComponent ? new intersection_1.IntersectionObserver(resolvedComponent.GenerateUniqueId('intob_'), intersectionOptions) : null);
        if (observer) {
            resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.AddIntersectionObserver(observer);
            observer.Observe(contextElement, ({ id, entry } = {}) => {
                var _a;
                if (entry === null || entry === void 0 ? void 0 : entry.isIntersecting) { //Element is visible
                    (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.RemoveIntersectionObserver(id);
                    effect();
                }
            });
        }
        else { //Immediate
            effect();
        }
    }
    else { //Immediate
        effect();
    }
}
exports.LazyCheck = LazyCheck;
