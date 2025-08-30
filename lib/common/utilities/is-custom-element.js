"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCustomElement = void 0;
const get_config_1 = require("../component/get-config");
function IsCustomElement(element) {
    const tagName = element.tagName.toLowerCase();
    return (0, get_config_1.GetConfig)().MatchesElement(tagName) && customElements.get(tagName) && element.matches(':defined');
}
exports.IsCustomElement = IsCustomElement;
