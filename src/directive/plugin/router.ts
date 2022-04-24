import { BootstrapAndAttach } from "../../bootstrap/attach";
import { FindComponentById } from "../../component/find";
import { RouterFetcher } from "../../concepts/fetcher";
import { DefaultRouterEvent, RouterConceptName, RouterEvents } from "../../concepts/names";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { GetGlobal } from "../../global/get";
import { JournalError } from "../../journal/error";
import { BindEvent } from "../event";
import { ResolveOptions } from "../options";

export const RouterDirectiveHandler = CreateDirectiveHandlerCallback(RouterConceptName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: RouterConceptName,
        event: argKey,
        defaultEvent: DefaultRouterEvent,
        eventWhitelist: RouterEvents,
        options: argOptions,
        optionBlacklist: ['outside'],
    })){
        return;
    }
    
    if (argKey === 'fetch'){
        if (!(contextElement instanceof HTMLTemplateElement)){
            return JournalError('Target is not a template element.', `${RouterConceptName}:${argKey}`, contextElement);
        }

        EvaluateLater({ componentId, contextElement, expression })((value) => {
            if (value && (typeof value === 'string' || value instanceof RegExp)){
                GetGlobal().GetRouterConcept()?.AddFetcher(new RouterFetcher(value, () => Promise.resolve(contextElement.innerHTML)));
            }
            else{
                JournalError('Target path is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
            }
        });
    }
    else if (argKey === 'mount'){
        if (!(contextElement instanceof HTMLTemplateElement)){
            return JournalError('Target is not a template element.', `${RouterConceptName}:${argKey}`, contextElement);
        }

        if (!contextElement.parentElement){
            return JournalError('Target must have a parent element.', `${RouterConceptName}:${argKey}`, contextElement);
        }

        EvaluateLater({ componentId, contextElement, expression })((value) => {
            let mountElement: HTMLElement;
            if (!value || typeof value === 'string'){
                try{
                    mountElement = document.createElement(value || 'div');
                    if (!mountElement){
                        mountElement = document.createElement('div');
                    }
                }
                catch{
                    mountElement = document.createElement('div');
                }

                contextElement.parentElement!.insertBefore(mountElement, contextElement);
            }
            else if (value instanceof HTMLElement){
                mountElement = value;
            }
            else{
                return JournalError('Mount target is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
            }

            let options = ResolveOptions({ options: { scroll: false }, list: argOptions }), event = `${RouterConceptName}.data`, onEvent = (e: Event) => {
                if (options.scroll){
                    window.scrollTo({ top: 0, left: 0 });
                }
                
                Array.from(mountElement.attributes).forEach(attr => mountElement.removeAttribute(attr.name));
                mountElement.innerHTML = (e as CustomEvent).detail.data;
                BootstrapAndAttach(mountElement);
            };

            window.addEventListener(event, onEvent);
            FindComponentById(componentId)?.FindElementScope(contextElement)?.AddUninitCallback(() => window.removeEventListener(event, onEvent));
        });
    }
    else if (argKey === 'link'){
        if (!(contextElement instanceof HTMLAnchorElement) && !(contextElement instanceof HTMLFormElement)){
            return JournalError('Target must be a anchor or form element.', `${RouterConceptName}:${argKey}`, contextElement);
        }

        let getPath: () => string, getEvent: () => string;
        if (contextElement instanceof HTMLFormElement){
            if (contextElement.method.toLowerCase() !== 'get'){
                return JournalError('Form element must use the GET method.', `${RouterConceptName}:${argKey}`, contextElement);
            }

            getPath = () => {
                let path = contextElement.action, query = '';
                (new FormData(contextElement)).forEach((value, key) => {
                    query = (query ? `${query}&${key}=${value.toString()}` : `${key}=${value.toString()}`);
                });
                return (query ? (path.includes('?') ? `${path}&${query}` : `${path}?${query}`) : path);
            };

            getEvent = () => 'submit';
        }
        else{//Anchor
            getPath = () => contextElement.href;
            getEvent = () => 'click';
        }

        let options = ResolveOptions({ options: { reload: false }, list: argOptions }), onEvent = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            GetGlobal().GetRouterConcept()?.Goto(getPath(), options.reload);
        };

        contextElement.addEventListener(getEvent(), onEvent);
    }
});

export function RouterDirectiveHandlerCompact(){
    AddDirectiveHandler(RouterDirectiveHandler);
}
