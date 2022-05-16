"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluateLater = void 0;
const generate_function_1 = require("./generate-function");
function EvaluateLater(options) {
    return (0, generate_function_1.GenerateFunctionFromString)(options);
}
exports.EvaluateLater = EvaluateLater;
