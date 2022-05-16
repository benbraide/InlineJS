import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { GetGlobal } from "../../global/get";
import { JournalError } from "../../journal/error";
import { AddChanges } from "../../proxy/add-changes";
import { BuildProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { UseEffect } from "../../reactive/effect";
import { ITimeDifferenceConcept, ITimeDifferenceTrackInfo } from "../../types/time-diff";
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
    })){
        return;
    }

    let concept = GetGlobal().GetConcept<ITimeDifferenceConcept>('tdiff'), localKey = '$tdiff';
    if (!concept){
        return JournalError('Time difference concept is not installed.', `InlineJS.tdiff`, contextElement);
    }
    
    let resolvedComponent = (component || FindComponentById(componentId)), elementScope = resolvedComponent?.FindElementScope(contextElement);
    if (!resolvedComponent || !elementScope){
        return JournalError('Failed to retrieve element scope.', `InlineJS.tdiff`, contextElement);
    }

    if (elementScope.HasLocal(localKey)){//Already initialized
        return;
    }

    let id = resolvedComponent.GenerateUniqueId('tdiff_proxy_'), info: ITimeDifferenceTrackInfo | null = null, savedLabel = '', options = ResolveOptions({
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
            let date: Date | null = null;
            if (typeof value === 'string' || typeof value === 'number' || value instanceof Date){
                date = new Date(value);
            }
            else if (value instanceof HTMLTimeElement){
                date = new Date(value.dateTime);
            }

            if (date){
                info && info.stop();
                info = GetGlobal().GetConcept<ITimeDifferenceConcept>('tdiff')?.Track({ date, ...options,
                    startImmediately: !options.stopped,
                    handler: (label) => {
                        AddChanges('set', `${id}.label`, 'label', FindComponentById(componentId)?.GetBackend().changes);
                        savedLabel = label;
                        contextElement.dispatchEvent(new CustomEvent(`tdiff.update`, { detail: { label } }));
                    },
                }) || null;
            }
        }),
    });

    elementScope.SetLocal(localKey, CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => {
            if (prop === 'label'){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return savedLabel;
            }

            if (prop === 'stopped'){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return info?.stopped();
            }
        },
        setter: (prop, value) => {
            if (prop === 'stopped'){
                if (!!value != info?.stopped()){
                    value ? info?.stop() : info?.resume();
                    AddChanges('set', `${id}.${prop}`, prop, FindComponentById(componentId)?.GetBackend().changes);
                }
            }
            return true;
        },
        lookup: ['label', 'stopped'],
    })));

    elementScope.AddUninitCallback(() => {
        info?.stop();
        info = null;
    });
});

export function TimeDifferenceDirectiveHandlerCompact(){
    AddDirectiveHandler(TimeDifferenceDirectiveHandler);
}
