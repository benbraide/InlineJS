import { FindComponentById } from "../../component/find";
import { ResourceConceptName } from "../../concepts/names";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { GetGlobal } from "../../global/get";
import { JournalError } from "../../journal/error";
import { AddChanges } from "../../proxy/add-changes";
import { BuildGetterProxyOptions, BuildProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { IResourceConcept } from "../../types/resource";
import { BindEvent } from "../event";
import { ResolveOptions } from "../options";

interface IQuillToolbarEntry{
    element: HTMLElement;
    name: string;
    action?: string;
    match?: string | boolean;
    active: boolean;
}

const QuillFieldGroups = {
    toggle: ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code'],
    size: ['size', 'small', 'normal', 'large', 'huge'],
    header: ['header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    align: ['align', 'left', 'center', 'right'],
    indent: ['indent', 'in', 'out'],
    list: ['list', 'bullet', 'ordered'],
    script: ['script', 'sub', 'super'],
    direction: ['direction', 'rtl'],
    prompts: ['link', 'image', 'video', 'color', 'background', 'font', 'indent'],
    mounts: ['container'],
};

let QuillUrl: Array<string> | string = '';

const QuillDirectiveName = 'quill';

export const QuillDirectiveHandler = CreateDirectiveHandlerCallback(QuillDirectiveName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: QuillDirectiveName,
        event: argKey,
        defaultEvent: 'ready',
        eventWhitelist: ['done'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })){
        return;
    }

    let resolvedComponent = (component || FindComponentById(componentId)), elementScope = resolvedComponent?.FindElementScope(contextElement);
    if (!resolvedComponent || !elementScope){
        return JournalError('Failed to retrieve element scope.', `InlineJS.${QuillDirectiveName}`, contextElement);
    }
    
    let localKey = `\$${QuillDirectiveName}`, detailsKey = `#${QuillDirectiveName}`;
    if (localKey in (elementScope.GetLocals() || {})){//Already initialized
        return;
    }

    let groupKey = Object.keys(QuillFieldGroups).find(key => QuillFieldGroups[key].includes(argKey));
    if (groupKey){
        let details = resolvedComponent.FindElementLocalValue(contextElement, detailsKey, true);
        if (!details){//No parent
            return;
        }

        let addToolbarItem = (name: string, match?: string | boolean, action?: string) => {
            if (name in details.toolbar){
                return;
            }

            let bindPrompt = (action: string, defaultValue = '') => {
                let input = contextElement.querySelector('input'), onEvent = (e: Event) => {
                    e.preventDefault();
                    e.stopPropagation();

                    details.quillInstance?.format(action, input!.value);
                    input!.value = defaultValue;

                    contextElement.dispatchEvent(new CustomEvent(`${QuillDirectiveName}.done`));
                };

                if (input){
                    input.value = defaultValue;
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter'){
                            onEvent(e);
                        }
                    });
                    contextElement.querySelector('button')?.addEventListener('click', onEvent);
                }
            };

            let prompt = (name.endsWith('.prompt') && name.substring(0, (name.length + '.prompt'.length)));
            if (prompt){//Prompt handled
                bindPrompt(prompt, ((prompt === 'link') ? 'https://' : ''));
                return;
            }

            if (name === 'container'){
                details.mounts.container = contextElement;
                return;
            }

            let id = resolvedComponent!.GenerateUniqueId(`${QuillDirectiveName}_proxy_`), toolbarEntry: IQuillToolbarEntry = { name, action, match,
                element: contextElement,
                active: false,
            }, computedAction = (toolbarEntry.action || toolbarEntry.name);

            let toolbarEntryProxy = CreateInplaceProxy(BuildGetterProxyOptions({
                getter: (prop) => {
                    if (prop && toolbarEntry.hasOwnProperty(prop)){
                        if (prop === 'active'){
                            FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                        }
                        return toolbarEntry[prop];
                    }
                    
                    if (prop === 'parent'){
                        return (contextElement.parentElement ? FindComponentById(componentId)?.FindElementLocalValue(contextElement.parentElement, localKey, true) : null);
                    }
                },
                lookup: [...Object.keys(toolbarEntry), 'parent'],
            }));

            details.toolbar[name] = toolbarEntry;
            details.toolbarProxy[name] = toolbarEntryProxy;

            if (match){//Bind listener
                contextElement.addEventListener('click', () => {
                    let isActive = toolbarEntry.active;
                    details.quillInstance.format(computedAction, (isActive ? false : toolbarEntry.match));
                    toolbarEntry.active = !isActive;
                    AddChanges('set', `${id}.active`, 'active', FindComponentById(componentId)?.GetBackend().changes);
                });
            }

            elementScope!.AddUninitCallback(() => {
                delete details.toolbar[name];
                delete details.toolbarProxy[name];
            });

            elementScope!.SetLocal(localKey, toolbarEntryProxy);
        };

        if (groupKey === 'toggle'){
            addToolbarItem(argKey, true, argKey);
        }
        else if (groupKey === 'prompts'){
            addToolbarItem(argOptions.includes('prompt') ? `${argKey}.prompt` : argKey);
        }
        else if (argKey === 'container'){
            addToolbarItem(argKey);
        }
        else if (argKey === groupKey){
            addToolbarItem(groupKey);
        }
        else if (groupKey === 'indent'){
            addToolbarItem(`${groupKey}.${argKey}`, ((argKey === 'out') ? '-1' : '+1'), groupKey);
        }
        else{//Standard
            addToolbarItem(`${groupKey}.${argKey}`, argKey, groupKey);
        }

        return;
    }

    let id = resolvedComponent.GenerateUniqueId(`${QuillDirectiveName}_proxy_`), options = ResolveOptions({
        options: {
            manual: false,
            readonly: false,
            snow: false,
        },
        list: argOptions,
    });

    let details = {
        quillInstance: <any>null,
        toolbar: <Record<string, IQuillToolbarEntry>>{},
        toolbarProxy: <Record<string, any>>{},
        mounts: {
            container: <HTMLElement | null>null,
        },
    };

    let setActive = (name: string, value: boolean) => {
        if (name in details.toolbar && value != details.toolbar[name].active){
            details.toolbar[name].active = value;
            AddChanges('set', `${id}.${name}.active`, 'active', FindComponentById(componentId)?.GetBackend().changes);
        }
    };

    let onEditorChange = () => {
        if (!details.quillInstance.hasFocus()){
            return;
        }

        let format = details.quillInstance.getFormat();
        Object.values(details.toolbar).forEach((entry) => {
            let isActive: boolean, action = (entry.action || entry.name);
            if (action in format){
                let value = ((action === 'indent') ? '+1' : format[action]);
                isActive = (entry.match === null || entry.match === undefined || entry.match === value);
            }
            else{
                isActive = false;
            }

            setActive(entry.name, isActive);
        });
    };

    let ready = false, init = () => {
        if (ready || !details.mounts.container || typeof window['Quill'] !== 'function'){
            return;
        }

        details.quillInstance = new window['Quill'](details.mounts.container, {
            modules: { toolbar: false },
            theme: (options.snow ? 'snow' : 'default'),
            readOnly: options.readonly,
        });

        details.quillInstance.on('editor-change', onEditorChange);
        ready = true;

        contextElement.dispatchEvent(new CustomEvent(`${QuillDirectiveName}.ready`));
    };

    elementScope.SetLocal(detailsKey, details);
    elementScope.SetLocal(localKey, CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => {
            if (prop === 'instance'){
                return details.quillInstance;
            }

            if (prop === 'container'){
                return details.mounts.container;
            }

            if (prop === 'bind'){
                return bind;
            }

            if (prop === 'url'){
                return QuillUrl;
            }
        },
        setter: (prop, value) => {
            if (prop === 'container' && !details.mounts.container){
                details.mounts.container = value;
                if (!options.manual){
                    init();
                }
            }

            if (prop === 'url'){
                QuillUrl = value;
            }

            return true;
        },
        lookup: ['instance', 'container', 'bind', 'url'],
    })));

    elementScope.AddUninitCallback(() => {
        if (details.quillInstance){
            details.quillInstance.off('editor-change', onEditorChange);
            details.quillInstance = null;
        }
    });

    let bind = () => {
        let resourceConcept = GetGlobal().GetConcept<IResourceConcept>(ResourceConceptName);
        if (QuillUrl && resourceConcept){
            resourceConcept.Get({
                items: QuillUrl,
                concurrent: true,
            }).then(init);
        }
        else{//Resource not provided
            init();
        }
    }

    if (!options.manual){
        bind();
    }
});

export function QuillDirectiveHandlerCompact(){
    AddDirectiveHandler(QuillDirectiveHandler);
}
