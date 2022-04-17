import { InsertHtml } from "../../../component/insert-html";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { UseEffect } from "../../../reactive/effect";

export const HtmlDirectiveHandler = CreateDirectiveHandlerCallback('html', ({ componentId, contextElement, expression }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression });
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(data => InsertHtml({
            element: contextElement,
            html: data,
            component: componentId,
            processDirectives: true,
        })),
    });
});

export function HtmlDirectiveHandlerCompact(){
    AddDirectiveHandler(HtmlDirectiveHandler);
}
