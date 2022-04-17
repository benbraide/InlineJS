import { FindComponentById } from "../../../component/find";
import { JournalError } from "../../../journal/error";
import { IComponent } from "../../../types/component";
import { ProcessDirectives } from "../../process";

export interface InsertCloneParams{
    componentId: string;
    component?: IComponent;
    contextElement: HTMLElement;
    parent: HTMLElement;
    clone: HTMLElement;
    relativeType?: 'before' | 'after';
    relative?: HTMLElement;
    copyLocals?: boolean;
    processDirectives?: boolean;
}

const RelativeOffsetKey = 'cntrl_rel_off';

export function InsertControlClone({ componentId, component, contextElement, parent, clone, relativeType, relative, copyLocals, processDirectives }: InsertCloneParams){
    let resolvedComponent = (component || FindComponentById(componentId));
    if (!resolvedComponent || !parent){
        JournalError('Failed to resolve component.', 'InlineJS.InsertClone', contextElement);
        return;
    }

    let resolvedRelative: Element | null = null, skipRelatives = (el: Element | null) => {
        let offset = (resolvedComponent!.FindElementScope(<HTMLElement>el)?.GetData(RelativeOffsetKey) || 0);
        if (typeof offset !== 'number' || offset <= 0){
            return el;
        }
        
        for (let i = 0; i < offset && el; ++i){
            el = el.nextElementSibling;
        }

        return skipRelatives(el);
    };
    
    if (relativeType === 'after'){
        resolvedRelative = skipRelatives((relative || contextElement).nextElementSibling);
    }
    else if (relativeType === 'before'){
        resolvedRelative = (relative || contextElement);
    }
    
    if (resolvedRelative){
        parent.insertBefore(clone, resolvedRelative);
    }
    else{
        parent.appendChild(clone);
    }

    if (copyLocals !== false){//Copy locals
        let elementScope = resolvedComponent.CreateElementScope(clone);
        Object.entries(resolvedComponent.FindElementScope(contextElement)?.GetLocals() || {}).forEach(([key, value]) => elementScope?.SetLocal(key, value));
    }

    if (processDirectives !== false){
        ProcessDirectives({
            component: componentId,
            element: clone,
            options: {
                checkDocument: false,
                checkTemplate: true,
            },
        });
    }
}

export function SetRelativeOffset(component: IComponent | string | null, element: HTMLElement, offset: number){
    ((typeof component === 'string') ? FindComponentById(component) : component)?.FindElementScope(element)?.SetData(RelativeOffsetKey, offset);
}
