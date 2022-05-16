import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { GetGlobal } from "../../global/get";
import { JournalError } from "../../journal/error";
import { AddChanges } from "../../proxy/add-changes";
import { BuildProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { UseEffect } from "../../reactive/effect";
import { BindEvent } from "../event";
import { ResolveOptions } from "../options";
export const TimeDifferenceDirectiveHandler = CreateDirectiveHandlerCallback('tdiff', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: 'tdiff',
        event: argKey,
        defaultEvent: 'update',
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })) {
        return;
    }
    let concept = GetGlobal().GetConcept('tdiff'), localKey = '$tdiff';
    if (!concept) {
        return JournalError('Time difference concept is not installed.', `InlineJS.tdiff`, contextElement);
    }
    let resolvedComponent = (component || FindComponentById(componentId)), elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindElementScope(contextElement);
    if (!resolvedComponent || !elementScope) {
        return JournalError('Failed to retrieve element scope.', `InlineJS.tdiff`, contextElement);
    }
    if (elementScope.HasLocal(localKey)) { //Already initialized
        return;
    }
    let id = resolvedComponent.GenerateUniqueId('tdiff_proxy_'), info = null, savedLabel = '', options = ResolveOptions({
        options: {
            short: false,
            ucfirst: false,
            capitalize: false,
            stopped: false,
        },
        list: argOptions,
    });
    let evaluate = EvaluateLater({ componentId, contextElement, expression });
    UseEffect({ componentId, contextElement,
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
                info = ((_a = GetGlobal().GetConcept('tdiff')) === null || _a === void 0 ? void 0 : _a.Track(Object.assign(Object.assign({ date }, options), { startImmediately: !options.stopped, handler: (label) => {
                        var _a;
                        AddChanges('set', `${id}.label`, 'label', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                        savedLabel = label;
                        contextElement.dispatchEvent(new CustomEvent(`tdiff.update`, { detail: { label } }));
                    } }))) || null;
            }
        }),
    });
    elementScope.SetLocal(localKey, CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => {
            var _a, _b;
            if (prop === 'label') {
                (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return savedLabel;
            }
            if (prop === 'stopped') {
                (_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return info === null || info === void 0 ? void 0 : info.stopped();
            }
        },
        setter: (prop, value) => {
            var _a;
            if (prop === 'stopped') {
                if (!!value != (info === null || info === void 0 ? void 0 : info.stopped())) {
                    value ? info === null || info === void 0 ? void 0 : info.stop() : info === null || info === void 0 ? void 0 : info.resume();
                    AddChanges('set', `${id}.${prop}`, prop, (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
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
export function TimeDifferenceDirectiveHandlerCompact() {
    AddDirectiveHandler(TimeDifferenceDirectiveHandler);
}
