import { FindComponentById } from "../../../component/find";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { JournalError } from "../../../journal/error";
import { UseEffect } from "../../../reactive/effect";
import { IDirectiveHandlerParams } from "../../../types/directives";

export function InitControl({ componentId, component, contextElement, expression, originalView }: IDirectiveHandlerParams){
    let resolvedComponent = (component || FindComponentById(componentId));
    if (!resolvedComponent || resolvedComponent.GetRoot() === contextElement){
        JournalError('Target is component root.', `'${originalView}'.Init`, contextElement);
        return null;
    }

    if (!(contextElement instanceof HTMLTemplateElement)){
        JournalError('Target is not a template element.', `'${originalView}'.Init`, contextElement);
        return null;
    }

    if (contextElement.content.children.length > 1){
        JournalError('Target must have a single child.', `'${originalView}'.Init`, contextElement);
        return null;
    }

    let evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true });
    return {
        checkpoint: 0,
        parent: contextElement.parentElement!,
        blueprint: (contextElement.content.firstElementChild as HTMLElement),
        effect: (handler: (value: any) => void) => UseEffect({ componentId, contextElement,
            callback: () => evaluate(handler),
        }),
        clone: () => <HTMLElement>contextElement.content.firstElementChild!.cloneNode(true),
    };
}
