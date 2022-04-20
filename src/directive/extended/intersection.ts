import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { JournalError } from "../../journal/error";
import { IIntersectionOptions } from "../../observers/intersection/options";
import { AddChanges } from "../../proxy/add-changes";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { BindEvent } from "../event";
import { ResolveOptions } from "../options";

type IntersectionVisibilityType = 'hidden' | 'visible' | 'visible.fully';

interface IIntersectionState{
    intersected: boolean;
    visible: IntersectionVisibilityType;
    ratio: number;
}

const intersectionDirectiveName = 'intersection';

export const IntersectionDirectiveHandler = CreateDirectiveHandlerCallback(intersectionDirectiveName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: intersectionDirectiveName,
        event: argKey,
        defaultEvent: 'intersected',
        eventWhitelist: ['in', 'out', 'visibility', 'visible', 'hidden'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside', 'once'],
    })){
        return;
    }
    
    let resolvedComponent = (component || FindComponentById(componentId));
    if (!resolvedComponent){
        return JournalError('Failed to resolve component.', 'InlineJS.IntersectionDirectiveHandler', contextElement);
    }

    let options = ResolveOptions({
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
    
    let intersectionOptions: IIntersectionOptions = {
        root: ((options.ancestor < 0) ? null : resolvedComponent.FindAncestor(contextElement, options.ancestor)),
        threshold: ((options.threshold < 0) ? 0 : options.threshold),
        spread: true,
    };

    let observer = resolvedComponent.CreateIntersectionObserver(intersectionOptions);
    if (!observer){
        return JournalError('Failed to create observer.', 'InlineJS.IntersectionDirectiveHandler', contextElement);
    }

    expression = expression.trim();
    let evaluate = (expression ? EvaluateLater({ componentId, contextElement, expression }) : null);

    let firstEntry = true, state: IIntersectionState = {
        intersected: false,
        visible: 'hidden',
        ratio: 0,
    };

    let getEventName = (name: string) => `${intersectionDirectiveName}.${name}`, eventDispatchers = {
        intersected: (value: boolean) => {
            contextElement.dispatchEvent(new CustomEvent(getEventName('intersected'), {
                detail: { value },
            }));

            contextElement.dispatchEvent(new CustomEvent(getEventName(value ? 'in' : 'out')));
        },
        visible: (value: IntersectionVisibilityType) => {
            contextElement.dispatchEvent(new CustomEvent(getEventName('visibility'), {
                detail: { value },
            }));

            if (value === 'visible.fully'){
                contextElement.dispatchEvent(new CustomEvent(getEventName('visible')));
            }
            else if (value === 'hidden'){
                contextElement.dispatchEvent(new CustomEvent(getEventName('hidden')));
            }
        },
        ratio: (value: number) => {
            contextElement.dispatchEvent(new CustomEvent(getEventName('ratio'), {
                detail: { value },
            }));
        },
    };

    let id = resolvedComponent.GenerateUniqueId('intsn_proxy_'), updateState = (key: keyof IIntersectionState, value: boolean | number | IntersectionVisibilityType) => {
        if (state[key] !== value){
            let component = FindComponentById(componentId);
            if (component){//Alert change
                AddChanges('set', `${id}.${key}`, key, component.GetBackend().changes);
            }
            
            (eventDispatchers[key] as (state: boolean | number | IntersectionVisibilityType) => void)((state[key] as boolean | number | IntersectionVisibilityType) = value);
        }
    };

    let cloneState = () => {
        let clone = {};
        Object.entries(state).forEach(([key, value]) => (clone[key] = value));
        return clone;
    };

    observer.Observe(contextElement, ({ id, entry } = {}) => {
        if (!entry || firstEntry && !entry.isIntersecting){//Element is not initially visible
            return;
        }

        let ratio = Math.round(entry.intersectionRatio * 100000)
        if (entry.isIntersecting){//In
            if ((options.out && !options.in) || (options.in && options.fully && ratio < 99000)){
                return;//Only 'out' option sepcified OR 'in' and 'fully' options specified but is not fully visible
            }

            updateState('intersected', true);
            updateState('ratio', entry.intersectionRatio);
            updateState('visible', ((ratio >= 99000) ? <IntersectionVisibilityType>'visible.fully' : <IntersectionVisibilityType>'visible'));
        }
        else{//Out
            if (options.in && !options.out){
                return;//Only 'in' option sepcified
            }

            updateState('visible', <IntersectionVisibilityType>'hidden');
            updateState('ratio', 0);
            updateState('intersected', false);
        }

        firstEntry = false;
        if (evaluate){
            evaluate(undefined, [cloneState()], {
                state: cloneState(),
            });
        }
        
        if (options.once){
            FindComponentById(componentId)?.RemoveIntersectionObserver(id!);
        }
    });

    let local = CreateInplaceProxy(BuildGetterProxyOptions({ getter: (prop) => {
        if (prop && state.hasOwnProperty(prop)){
            return state[prop];
        }
    }, lookup: [...Object.keys(state)], alert: { componentId, id } }));

    resolvedComponent.FindElementScope(contextElement)?.SetLocal(`\$${intersectionDirectiveName}`, local);
});

export function IntersectionDirectiveHandlerCompact(){
    AddDirectiveHandler(IntersectionDirectiveHandler);
}
