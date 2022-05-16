import { FindComponentById } from "../../../component/find";
import { NextTick } from "../../../component/next-tick";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { ResolveOptions } from "../../options";
export const PostDirectiveHandler = CreateDirectiveHandlerCallback('post', ({ componentId, component, contextElement, expression, argOptions }) => {
    var _a, _b;
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), options = ResolveOptions({
        options: {
            nexttick: false,
        },
        list: argOptions,
    });
    let nextTick = (options.nexttick ? new NextTick(componentId, evaluate, true) : null);
    (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddPostProcessCallback(() => (nextTick ? nextTick.Queue() : evaluate()));
});
export function PostDirectiveHandlerCompact() {
    AddDirectiveHandler(PostDirectiveHandler);
}
