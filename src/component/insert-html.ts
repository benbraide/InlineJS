import { ProcessDirectives } from "../directive/process";
import { WaitTransition } from "../directive/transition";
import { JournalTry } from "../journal/try";
import { IComponent } from "../types/component";
import { FindComponentById } from "./find";

export type InsertionType = 'replace' | 'append' | 'prepend';

export interface InsertionOptions{
    element: HTMLElement;
    html: string;
    type?: InsertionType;
    component?: IComponent | string;
    processDirectives?: boolean;
    afterInsert?: () => void;
    afterTransitionCallback?: () => void;
    transitionScope?: HTMLElement;
}

export function InsertHtml({ element, html, type = 'replace', component, processDirectives = true, afterInsert, afterTransitionCallback, transitionScope }: InsertionOptions){
    let componentId = ((typeof component === 'string') ? component : (component?.GetId() || '')), insert = () => {
        let tmpl = document.createElement('template');
        tmpl.innerHTML = html;

        if (type === 'replace' || type === 'append'){
            element.append(...Array.from(tmpl.content.childNodes));
        }
        else if (type === 'prepend'){//Insert before child nodes
            element.prepend(...Array.from(tmpl.content.childNodes));
        }

        (afterInsert && JournalTry(afterInsert, 'InlineJS.InsertHtml', element));

        let resolvedComponent = FindComponentById(componentId);
        if (processDirectives && resolvedComponent){
            Array.from(element.children).forEach(child => ProcessDirectives({
                component: resolvedComponent!,
                element: child,
                options: {
                    checkTemplate: true,
                    checkDocument: true,
                    ignoreChildren: false,
                },
            }));
        }

        if (afterTransitionCallback){
            (transitionScope || element).dispatchEvent(new CustomEvent('html.transition.begin', { detail: { insert: true } }));
            WaitTransition({ componentId,
                contextElement: (transitionScope || element),
                target: element,
                callback: () => (((transitionScope || element).dispatchEvent(new CustomEvent('html.transition.end', { detail: { insert: true } })) && false) || afterTransitionCallback()),
            });
        }
    };

    if (type === 'replace'){//Remove all child nodes
        let destroyOffspring = (el: Element) => {//Destroy offspring with scopes or search down the tree
            let resolvedComponent = FindComponentById(componentId);
            Array.from(el.children).forEach((child) => {
                let elementScope = resolvedComponent?.FindElementScope(child);
                if (elementScope){
                    elementScope.Destroy();
                }
                else{
                    destroyOffspring(child);
                }
            });
        };

        let remove = () => {
            destroyOffspring(element);
            Array.from(element.childNodes).forEach(child => child.remove());
            insert();
        };

        if (afterTransitionCallback){
            (transitionScope || element).dispatchEvent(new CustomEvent('html.transition.begin', { detail: { insert: false } }));
            WaitTransition({ componentId,
                contextElement: (transitionScope || element),
                target: element,
                reverse: true,
                callback: () => (((transitionScope || element).dispatchEvent(new CustomEvent('html.transition.end', { detail: { insert: false } })) && false) || remove()),
            });
        }
        else{
            remove();
        }
    }
    else{
        insert();
    }
}
