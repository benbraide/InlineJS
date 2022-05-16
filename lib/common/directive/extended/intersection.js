"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectionDirectiveHandlerCompact = exports.IntersectionDirectiveHandler = void 0;
const find_1 = require("../../component/find");
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
const evaluate_later_1 = require("../../evaluator/evaluate-later");
const error_1 = require("../../journal/error");
const add_changes_1 = require("../../proxy/add-changes");
const create_1 = require("../../proxy/create");
const event_1 = require("../event");
const options_1 = require("../options");
const IntersectionDirectiveName = 'intersection';
exports.IntersectionDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)(IntersectionDirectiveName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a;
    if ((0, event_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: IntersectionDirectiveName,
        event: argKey,
        defaultEvent: 'intersected',
        eventWhitelist: ['in', 'out', 'visibility', 'visible', 'hidden'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside', 'once'],
    })) {
        return;
    }
    let resolvedComponent = (component || (0, find_1.FindComponentById)(componentId));
    if (!resolvedComponent) {
        return (0, error_1.JournalError)('Failed to resolve component.', 'InlineJS.IntersectionDirectiveHandler', contextElement);
    }
    let options = (0, options_1.ResolveOptions)({
        options: {
            once: false,
            in: false,
            out: false,
            fully: false,
            ancestor: -1,
            threshold: -1,
        },
        list: argOptions,
        defaultNumber: -1,
    });
    let intersectionOptions = {
        root: ((options.ancestor < 0) ? null : resolvedComponent.FindAncestor(contextElement, options.ancestor)),
        threshold: ((options.threshold < 0) ? 0 : options.threshold),
        spread: true,
    };
    let observer = resolvedComponent.CreateIntersectionObserver(intersectionOptions);
    if (!observer) {
        return (0, error_1.JournalError)('Failed to create observer.', 'InlineJS.IntersectionDirectiveHandler', contextElement);
    }
    expression = expression.trim();
    let evaluate = (expression ? (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression }) : null);
    let firstEntry = true, state = {
        intersected: false,
        visible: 'hidden',
        ratio: 0,
    };
    let getEventName = (name) => `${IntersectionDirectiveName}.${name}`, eventDispatchers = {
        intersected: (value) => {
            contextElement.dispatchEvent(new CustomEvent(getEventName('intersected'), {
                detail: { value },
            }));
            contextElement.dispatchEvent(new CustomEvent(getEventName(value ? 'in' : 'out')));
        },
        visible: (value) => {
            contextElement.dispatchEvent(new CustomEvent(getEventName('visibility'), {
                detail: { value },
            }));
            if (value === 'visible.fully') {
                contextElement.dispatchEvent(new CustomEvent(getEventName('visible')));
            }
            else if (value === 'hidden') {
                contextElement.dispatchEvent(new CustomEvent(getEventName('hidden')));
            }
        },
        ratio: (value) => {
            contextElement.dispatchEvent(new CustomEvent(getEventName('ratio'), {
                detail: { value },
            }));
        },
    };
    let id = resolvedComponent.GenerateUniqueId('intsn_proxy_'), updateState = (key, value) => {
        if (state[key] !== value) {
            let component = (0, find_1.FindComponentById)(componentId);
            if (component) { //Alert change
                (0, add_changes_1.AddChanges)('set', `${id}.${key}`, key, component.GetBackend().changes);
            }
            eventDispatchers[key](state[key] = value);
        }
    };
    let cloneState = () => {
        let clone = {};
        Object.entries(state).forEach(([key, value]) => (clone[key] = value));
        return clone;
    };
    observer.Observe(contextElement, ({ id, entry } = {}) => {
        var _a;
        if (!entry || firstEntry && !entry.isIntersecting) { //Element is not initially visible
            return;
        }
        let ratio = Math.round(entry.intersectionRatio * 100000);
        if (entry.isIntersecting) { //In
            if ((options.out && !options.in) || (options.in && options.fully && ratio < 99000)) {
                return; //Only 'out' option sepcified OR 'in' and 'fully' options specified but is not fully visible
            }
            updateState('intersected', true);
            updateState('ratio', entry.intersectionRatio);
            updateState('visible', ((ratio >= 99000) ? 'visible.fully' : 'visible'));
        }
        else { //Out
            if (options.in && !options.out) {
                return; //Only 'in' option sepcified
            }
            updateState('visible', 'hidden');
            updateState('ratio', 0);
            updateState('intersected', false);
        }
        firstEntry = false;
        if (evaluate) {
            evaluate(undefined, [cloneState()], {
                state: cloneState(),
            });
        }
        if (options.once) {
            (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.RemoveIntersectionObserver(id);
        }
    });
    let local = (0, create_1.CreateInplaceProxy)((0, create_1.BuildGetterProxyOptions)({ getter: (prop) => {
            if (prop && state.hasOwnProperty(prop)) {
                return state[prop];
            }
        }, lookup: [...Object.keys(state)], alert: { componentId, id } }));
    (_a = resolvedComponent.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.SetLocal(`\$${IntersectionDirectiveName}`, local);
});
function IntersectionDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.IntersectionDirectiveHandler);
}
exports.IntersectionDirectiveHandlerCompact = IntersectionDirectiveHandlerCompact;
