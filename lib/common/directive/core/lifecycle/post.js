"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDirectiveHandlerCompact = exports.PostDirectiveHandler = void 0;
const find_1 = require("../../../component/find");
const next_tick_1 = require("../../../component/next-tick");
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
const options_1 = require("../../options");
exports.PostDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('post', ({ componentId, component, contextElement, expression, argOptions }) => {
    var _a, _b;
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression }), options = (0, options_1.ResolveOptions)({
        options: {
            nexttick: false,
        },
        list: argOptions,
    });
    let nextTick = (options.nexttick ? new next_tick_1.NextTick(componentId, evaluate, true) : null);
    (_b = (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddPostProcessCallback(() => (nextTick ? nextTick.Queue() : evaluate()));
});
function PostDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.PostDirectiveHandler);
}
exports.PostDirectiveHandlerCompact = PostDirectiveHandlerCompact;
