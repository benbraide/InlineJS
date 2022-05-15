import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { GetGlobal } from "../../../global/get";
import { IAnimationTransition } from "../../../types/animation";
import { LazyCheck } from "../../lazy";
import { DefaultTransitionDelay, DefaultTransitionDuration, DefaultTransitionRepeats, ResolveTransition, WaitTransition } from "../../transition";

export const AnimateDirectiveHandler = CreateDirectiveHandlerCallback('animate', ({ componentId, contextElement, argKey, argOptions, ...rest }) => {
    let options = {
        alternate: argOptions.includes('alternate'),
        normal: argOptions.includes('normal'),
        inner: (argKey === 'inner'),
    };

    argOptions = argOptions.filter(opt => (opt !== 'normal'));
    let traverseTargets = (callback: (target: HTMLElement) => void) => (options.inner ? Array.from(contextElement.children) : [contextElement]).forEach((target) => {
        callback(<HTMLElement>target);
    });

    let checkpoint = 0, bind = () => {
        let waitTransition = (reverse: boolean, target?: HTMLElement, callback?: () => void) => {
            let myCheckpoint = ++checkpoint;
            transitionCancel = WaitTransition({ componentId, contextElement, target, reverse,
                callback: (waited) => {
                    if (myCheckpoint == checkpoint){
                        transitionCancel = null;
                        if (waited){
                            callback && callback();
                        }
                        else{
                            traverseTargets(child => (child as HTMLElement).style.removeProperty('transform'));
                        }
                    }
                },
            });
        }

        let childIndex = 0, handleInner = (reverse: boolean) => {
            if (childIndex < contextElement.children.length){
                waitTransition(reverse, <HTMLElement>contextElement.children[childIndex++], () => handleInner(reverse));
            }
            else{
                repeat(options.alternate ? !reverse : reverse);
            }
        };

        let begin = (reverse: boolean) => {
            checkpoint += 1;
            if (options.inner){
                childIndex = 0;
                handleInner(reverse);
            }
            else{
                waitTransition(reverse, undefined, () => repeat(options.alternate ? !reverse : reverse));
            }
        };

        let repeat = (reverse: boolean) => {
            let info = ResolveTransition((FindComponentById(componentId)?.FindElementScope(contextElement)?.GetData('transition') || null), reverse);
            if (info && info.repeats){
                let myCheckpoint = ++checkpoint;
                (info.repeats > 0) && (info.repeats -= 1);
                setTimeout(() => {
                    if (myCheckpoint == checkpoint){
                        contextElement.dispatchEvent(new CustomEvent('animate.repeat'));
                        begin(reverse);
                    }
                }, (info.delay || DefaultTransitionDelay));
            }
        };
        
        let lastValue = false, transitionCancel: (() => void) | null = null, apply = (value: any) => {
            if (!!value === lastValue){
                return;
            }
    
            if (transitionCancel){
                transitionCancel();
                (options.inner ? Array.from(contextElement.children) : [contextElement]).forEach(child => {
                    (child as HTMLElement).style.removeProperty('transform');
                    (child as HTMLElement).style.removeProperty('opacity');
                });
            }

            if (!options.normal || !!value){
                begin(!value);
            }
            
            lastValue = !!value;
        };
    
        LazyCheck({ componentId, contextElement, argKey, argOptions, ...rest,
            callback: apply,
        });
    };

    if (options.inner){
        FindComponentById(componentId)?.FindElementScope(contextElement)?.AddPostProcessCallback(bind);
    }
    else{//Immediate
        bind();
    }

    let data = FindComponentById(componentId)?.FindElementScope(contextElement)?.GetData('transition');
    if (!data || GetGlobal().IsNothing(data)){
        FindComponentById(componentId)?.FindElementScope(contextElement)?.SetData('transition', <IAnimationTransition>{
            actor: null,
            ease: null,
            duration: DefaultTransitionDuration,
            repeats: DefaultTransitionRepeats,
            delay: DefaultTransitionDelay,
            allowed: (!argOptions.includes('normal') ? (argOptions.includes('reversed') ? 'reversed' : 'both') : 'normal'),
        });
    }

    FindComponentById(componentId)?.FindElementScope(contextElement)?.AddUninitCallback(() => (checkpoint += 1));
});

export function AnimateDirectiveHandlerCompact(){
    AddDirectiveHandler(AnimateDirectiveHandler);
}
