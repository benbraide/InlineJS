"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeDifferenceDirectiveHandlerCompact = exports.TimeDifferenceDirectiveHandler = void 0;
const find_1 = require("../../component/find");
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
const evaluate_later_1 = require("../../evaluator/evaluate-later");
const get_1 = require("../../global/get");
const error_1 = require("../../journal/error");
const add_changes_1 = require("../../proxy/add-changes");
const create_1 = require("../../proxy/create");
const effect_1 = require("../../reactive/effect");
const event_1 = require("../event");
const options_1 = require("../options");
exports.TimeDifferenceDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('tdiff', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if ((0, event_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: 'tdiff',
        event: argKey,
        defaultEvent: 'update',
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })) {
        return;
    }
    let concept = (0, get_1.GetGlobal)().GetConcept('tdiff'), localKey = '$tdiff';
    if (!concept) {
        return (0, error_1.JournalError)('Time difference concept is not installed.', `InlineJS.tdiff`, contextElement);
    }
    let resolvedComponent = (component || (0, find_1.FindComponentById)(componentId)), elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindElementScope(contextElement);
    if (!resolvedComponent || !elementScope) {
        return (0, error_1.JournalError)('Failed to retrieve element scope.', `InlineJS.tdiff`, contextElement);
    }
    if (elementScope.HasLocal(localKey)) { //Already initialized
        return;
    }
    let id = resolvedComponent.GenerateUniqueId('tdiff_proxy_'), info = null, savedLabel = '', options = (0, options_1.ResolveOptions)({
        options: {
            short: false,
            ucfirst: false,
            capitalize: false,
            stopped: false,
        },
        list: argOptions,
    });
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression });
    (0, effect_1.UseEffect)({ componentId, contextElement,
        callback: () => evaluate((value) => {
            var _a;
            let date = null;
            if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
                date = new Date(value);
            }
            else if (value instanceof HTMLTimeElement) {
                date = new Date(value.dateTime);
            }
            if (date) {
                info && info.stop();
                info = ((_a = (0, get_1.GetGlobal)().GetConcept('tdiff')) === null || _a === void 0 ? void 0 : _a.Track(Object.assign(Object.assign({ date }, options), { startImmediately: !options.stopped, handler: (label) => {
                        var _a;
                        (0, add_changes_1.AddChanges)('set', `${id}.label`, 'label', (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                        savedLabel = label;
                        contextElement.dispatchEvent(new CustomEvent(`tdiff.update`, { detail: { label } }));
                    } }))) || null;
            }
        }),
    });
    elementScope.SetLocal(localKey, (0, create_1.CreateInplaceProxy)((0, create_1.BuildProxyOptions)({
        getter: (prop) => {
            var _a, _b;
            if (prop === 'label') {
                (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return savedLabel;
            }
            if (prop === 'stopped') {
                (_b = (0, find_1.FindComponentById)(componentId)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return info === null || info === void 0 ? void 0 : info.stopped();
            }
        },
        setter: (prop, value) => {
            var _a;
            if (prop === 'stopped') {
                if (!!value != (info === null || info === void 0 ? void 0 : info.stopped())) {
                    value ? info === null || info === void 0 ? void 0 : info.stop() : info === null || info === void 0 ? void 0 : info.resume();
                    (0, add_changes_1.AddChanges)('set', `${id}.${prop}`, prop, (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                }
            }
            return true;
        },
        lookup: ['label', 'stopped'],
    })));
    elementScope.AddUninitCallback(() => {
        info === null || info === void 0 ? void 0 : info.stop();
        info = null;
    });
});
function TimeDifferenceDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.TimeDifferenceDirectiveHandler);
}
exports.TimeDifferenceDirectiveHandlerCompact = TimeDifferenceDirectiveHandlerCompact;
