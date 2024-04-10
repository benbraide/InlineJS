"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyCheck = void 0;
const find_1 = require("../component/find");
const set_proxy_access_handler_1 = require("../component/set-proxy-access-handler");
const evaluate_later_1 = require("../evaluator/evaluate-later");
const wait_promise_1 = require("../evaluator/wait-promise");
const try_1 = require("../journal/try");
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
        const resolvedComponent = (component || (0, find_1.FindComponentById)(componentId)), intersectionOptions = {
            root: ((resolvedOptions.ancestor < 0) ? null : resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindAncestor(contextElement, resolvedOptions.ancestor)),
            threshold: ((resolvedOptions.threshold < 0) ? 0 : resolvedOptions.threshold),
        };
        const observer = (resolvedComponent ? new intersection_1.IntersectionObserver(resolvedComponent.GenerateUniqueId('intob_'), intersectionOptions) : null);
        if (observer) {
            const proxyAccessHandler = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.GetProxyAccessHandler();
            resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.AddIntersectionObserver(observer);
            observer.Observe(contextElement, ({ id, entry } = {}) => {
                var _a;
                if (entry === null || entry === void 0 ? void 0 : entry.isIntersecting) { //Element is visible
                    const pahCallback = (0, set_proxy_access_handler_1.SetProxyAccessHandler)(componentId, (proxyAccessHandler || null)); //Use captured proxyAccessHandler
                    (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.RemoveIntersectionObserver(id);
                    (0, try_1.JournalTry)(effect);
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
exports.LazyCheck = LazyCheck;
