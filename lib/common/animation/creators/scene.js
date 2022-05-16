"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneAnimationCreator = void 0;
const generic_1 = require("../actors/scene/generic");
function SceneAnimationCreator(params) {
    return (0, generic_1.CreateSceneAnimationCallback)(params);
}
exports.SceneAnimationCreator = SceneAnimationCreator;
