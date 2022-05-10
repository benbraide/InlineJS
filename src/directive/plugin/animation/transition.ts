import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { GetGlobal } from "../../../global/get";
import { UseEffect } from "../../../reactive/effect";
import { IAnimationConcept, IAnimationTransition } from "../../../types/animation";
import { Nothing } from "../../../values/nothing";
import { BindEvent } from "../../event";

export const TransitionDirectiveHandler = CreateDirectiveHandlerCallback('transition', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: 'transition',
        event: argKey,
        defaultEvent: 'enter',
        eventWhitelist: ['leave', 'canceled'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })){
        return;
    }
    
    let data: IAnimationTransition | Nothing = (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.GetData('transition');
    if (argKey === 'actor' && !GetGlobal().IsNothing(data)){
        let evaluate = EvaluateLater({ componentId, contextElement, expression }), updateActor = (value: any) => {
            if (typeof value === 'string'){
                (data as IAnimationTransition).actor = (GetGlobal().GetConcept<IAnimationConcept>('animation')?.GetActorCollection().Find(value) || null);
            }
            else{
                (data as IAnimationTransition).actor = (value || null);
            }
        };

        UseEffect({ componentId, contextElement,
            callback: () => evaluate(updateActor),
        });
    }
    else if (argKey === 'duration' && !GetGlobal().IsNothing(data)){
        let evaluate = EvaluateLater({ componentId, contextElement, expression }), updateDuration = (value: any) => {
            (data as IAnimationTransition).duration = (((typeof value === 'number') && value) || 300);
        };

        UseEffect({ componentId, contextElement,
            callback: () => evaluate(updateDuration),
        });
    }
    else if (argKey === 'ease' && !GetGlobal().IsNothing(data)){
        let evaluate = EvaluateLater({ componentId, contextElement, expression }), updateEase = (value: any) => {
            if (typeof value === 'string'){
                (data as IAnimationTransition).ease = (GetGlobal().GetConcept<IAnimationConcept>('animation')?.GetEaseCollection().Find(value) || null);
            }
            else{
                (data as IAnimationTransition).ease = (value || null);
            }
        };

        UseEffect({ componentId, contextElement,
            callback: () => evaluate(updateEase),
        });
    }
    else if (!data || GetGlobal().IsNothing(data)){
        (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.SetData('transition', <IAnimationTransition>{
            actor: null,
            ease: null,
            duration: 300,
            allowed: (!argOptions.includes('normal') ? (argOptions.includes('reversed') ? 'reversed' : 'both') : 'normal'),
        });
    }
});

export function TransitionDirectiveHandlerCompact(){
    AddDirectiveHandler(TransitionDirectiveHandler);
}
