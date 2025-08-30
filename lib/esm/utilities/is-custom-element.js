import { GetConfig } from "../component/get-config";
export function IsCustomElement(element) {
    const tagName = element.tagName.toLowerCase();
    return GetConfig().MatchesElement(tagName) && customElements.get(tagName) && element.matches(':defined');
}
