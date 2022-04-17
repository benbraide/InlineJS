import { FindComponentById } from "../../../component/find";
import { NextTick } from "../../../component/next-tick";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { ResolveOptions } from "../../options";

export const PostDirectiveHandler = CreateDirectiveHandlerCallback('post', ({ componentId, component, contextElement, expression, argOptions }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), options = ResolveOptions({
        options: {
            nexttick: false,
        },
        list: argOptions,
    });

    let nextTick = (options.nexttick ? new NextTick(componentId, evaluate, true) : null);
    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddPostProcessCallback(() => (nextTick ? nextTick.Queue() : evaluate()));
});

export function PostDirectiveHandlerCompact(){
    AddDirectiveHandler(PostDirectiveHandler);
}
