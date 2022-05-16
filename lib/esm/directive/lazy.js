import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { WaitPromise } from "../evaluator/wait-promise";
import { UseEffect } from "../reactive/effect";
import { ResolveOptions } from "./options";
export function LazyCheck({ componentId, component, contextElement, expression, argOptions, callback, options, defaultOptionValue, useEffect }) {
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), resolvedOptions = ResolveOptions({
        options: (options || {
            lazy: false,
            ancestor: -1,
            threshold: -1,
        }),
        list: argOptions,
        defaultNumber: ((defaultOptionValue === 0) ? 0 : (defaultOptionValue || -1)),
    });
    let doEvaluation = () => evaluate(data => WaitPromise(data, callback)), effect = () => ((useEffect === false) ? doEvaluation() : UseEffect({ componentId, contextElement,
        callback: doEvaluation,
    }));
    if (resolvedOptions.lazy) { //Wait until element is visible
        let resolvedComponent = (component || FindComponentById(componentId)), intersectionOptions = {
            root: ((resolvedOptions.ancestor < 0) ? null : resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindAncestor(contextElement, resolvedOptions.ancestor)),
            threshold: ((resolvedOptions.threshold < 0) ? 0 : resolvedOptions.threshold),
        };
        let observer = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.CreateIntersectionObserver(intersectionOptions);
        if (observer) {
            observer.Observe(contextElement, ({ id, entry } = {}) => {
                var _a;
                if (entry === null || entry === void 0 ? void 0 : entry.isIntersecting) { //Element is visible
                    (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.RemoveIntersectionObserver(id);
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
