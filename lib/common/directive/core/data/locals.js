"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalsDirectiveHandlerCompact = exports.LocalsDirectiveHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
const get_target_1 = require("../../../utilities/get-target");
const is_object_1 = require("../../../utilities/is-object");
exports.LocalsDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('locals', ({ componentId, contextElement, expression }) => {
    (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression })((data) => {
        var _a;
        let elementScope = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement);
        data = (0, get_target_1.GetTarget)(data);
        data = (((0, is_object_1.IsObject)(data) && data) || {});
        Object.entries(data).forEach(([key, value]) => elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(key, value));
    });
});
function LocalsDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.LocalsDirectiveHandler);
}
exports.LocalsDirectiveHandlerCompact = LocalsDirectiveHandlerCompact;
