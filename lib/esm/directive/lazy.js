import { FindComponentById } from "../component/find";
import { SetProxyAccessHandler } from "../component/set-proxy-access-handler";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { WaitPromise } from "../evaluator/wait-promise";
import { JournalTry } from "../journal/try";
import { IntersectionObserver } from "../observers/intersection";
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
        const resolvedComponent = (component || FindComponentById(componentId)), intersectionOptions = {
            root: ((resolvedOptions.ancestor < 0) ? null : resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindAncestor(contextElement, resolvedOptions.ancestor)),
            threshold: ((resolvedOptions.threshold < 0) ? 0 : resolvedOptions.threshold),
        };
        const observer = (resolvedComponent ? new IntersectionObserver(resolvedComponent.GenerateUniqueId('intob_'), intersectionOptions) : null);
        if (observer) {
            const proxyAccessHandler = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.GetProxyAccessHandler();
            resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.AddIntersectionObserver(observer);
            observer.Observe(contextElement, ({ id, entry } = {}) => {
                var _a;
                if (entry === null || entry === void 0 ? void 0 : entry.isIntersecting) { //Element is visible
                    const pahCallback = SetProxyAccessHandler(componentId, (proxyAccessHandler || null)); //Use captured proxyAccessHandler
                    if (id) {
                        const component = FindComponentById(componentId);
                        (_a = component === null || component === void 0 ? void 0 : component.FindIntersectionObserver(id)) === null || _a === void 0 ? void 0 : _a.Destroy();
                        component === null || component === void 0 ? void 0 : component.RemoveIntersectionObserver(id);
                    }
                    JournalTry(effect);
                    pahCallback();
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
