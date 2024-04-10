"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindEvent = exports.ForwardEvent = void 0;
const get_1 = require("../global/get");
const create_1 = require("./create");
const dispatch_1 = require("./dispatch");
function ForwardEvent(component, contextElement, event, expression, options) {
    const name = (0, get_1.GetGlobal)().GetConfig().GetDirectiveName('on'), joinedOptions = (options || []).join('.');
    const qName = (joinedOptions ? `${name}:${event}.${joinedOptions}` : `${name}:${event}`), directive = (0, create_1.CreateDirective)(qName, (expression || ''));
    return (directive ? (0, dispatch_1.DispatchDirective)(component, contextElement, directive) : false);
}
exports.ForwardEvent = ForwardEvent;
const defaultEventList = ['bind', 'event', 'on'];
function BindEvent({ component, contextElement, key, event, expression, options, defaultEvent, eventWhitelist = [], optionBlacklist }) {
    const filterOptions = () => (optionBlacklist ? options === null || options === void 0 ? void 0 : options.filter(opt => !optionBlacklist.includes(opt)) : options), getEventName = (name) => {
        return (key ? `${key}-${name}.join` : name);
    };
    if (eventWhitelist.includes(event)) {
        return ForwardEvent(component, contextElement, getEventName(event), expression, filterOptions());
    }
    if (defaultEvent && (event === defaultEvent || defaultEventList.includes(event))) {
        return ForwardEvent(component, contextElement, getEventName(defaultEvent), expression, filterOptions());
    }
    return false;
}
exports.BindEvent = BindEvent;
