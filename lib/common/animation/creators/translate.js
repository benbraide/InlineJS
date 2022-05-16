"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateAnimationCreator = void 0;
const generic_1 = require("../actors/translate/generic");
function TranslateAnimationCreator(params = {}) {
    return (0, generic_1.CreateTranslateAnimationCallback)(params);
}
exports.TranslateAnimationCreator = TranslateAnimationCreator;
