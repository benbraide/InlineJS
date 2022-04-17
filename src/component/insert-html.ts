import { ProcessDirectives } from "../directive/process";
import { IComponent } from "../types/component";
import { FindComponentById } from "./find";

export type InsertionType = 'replace' | 'append' | 'prepend';

export interface InsertionOptions{
    element: HTMLElement;
    html: string;
    type?: InsertionType;
    component?: IComponent | string;
    processDirectives?: boolean;
}

export function InsertHtml({ element, html, type = 'replace', component, processDirectives = true }: InsertionOptions){
    let resolvedComponent = (((component && typeof component === 'string') ? FindComponentById(component) : <IComponent>component) || null);
    if (type === 'replace'){//Remove all child nodes
        let destroyOffspring = (el: Element) => {//Destroy offspring with scopes or search down the tree
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

        destroyOffspring(element);
        Array.from(element.childNodes).forEach(child => child.remove());
    }

    let tmpl = document.createElement('template');
    tmpl.innerHTML = html;

    if (type === 'replace' || type === 'append'){
        element.append(...Array.from(tmpl.content.childNodes));
    }
    else if (type === 'prepend'){//Insert before child nodes
        element.prepend(...Array.from(tmpl.content.childNodes));
    }

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
}
