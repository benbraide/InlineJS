import { InsertHtml } from "../../../component/insert-html";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { WaitWhile } from "../../../evaluator/wait-while";
import { LazyCheck } from "../../lazy";

export const HtmlDirectiveHandler = CreateDirectiveHandlerCallback('html', ({ componentId, contextElement, ...rest }) => {
    let checkpoint = 0;
    LazyCheck({ componentId, contextElement, ...rest,
        callback: (value) => {
            let myCheckpoint = ++checkpoint;
            WaitWhile(value, (value) => {
                if (myCheckpoint == checkpoint){
                    InsertHtml({
                        element: contextElement,
                        html: value,
                        component: componentId,
                        processDirectives: true,
                    });
                }
            });
        },
    });
});

export function HtmlDirectiveHandlerCompact(){
    AddDirectiveHandler(HtmlDirectiveHandler);
}
