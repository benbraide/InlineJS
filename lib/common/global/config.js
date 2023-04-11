"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const is_object_1 = require("../utilities/is-object");
class Config {
    constructor({ appName = '', reactiveState = 'unoptimized', directivePrefix = 'x', elementPrefix, directiveRegex, directiveNameBuilder } = {}) {
        this.keyMap_ = {
            'return': 'enter',
            ctrl: 'control',
            esc: 'escape',
            space: ' ',
            menu: 'contextmenu',
            del: 'delete',
            ins: 'insert',
            plus: '+',
            minus: '-',
            star: '*',
            slash: '/',
            alpha: Array.from({ length: 26 }).map((i, index) => String.fromCharCode(index + 97)),
            digit: Array.from({ length: 10 }).map((i, index) => index.toString()),
        };
        this.booleanAttributes_ = new Array('allowfullscreen', 'allowpaymentrequest', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'defer', 'disabled', 'formnovalidate', 'hidden', 'ismap', 'itemscope', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'selected');
        globalThis['InlineJS'] = (globalThis['InlineJS'] || {});
        let config = (globalThis['InlineJS'].config || {});
        config = ((0, is_object_1.IsObject)(config) ? config : {});
        this.appName_ = (config.appName || appName);
        this.reactiveState_ = (config.reactiveState || reactiveState);
        this.directivePrefix_ = (config.directivePrefix || directivePrefix);
        this.elementPrefix_ = (config.elementPrefix || elementPrefix || directivePrefix);
        this.directiveRegex_ = (directiveRegex || new RegExp(`^(data-)?${directivePrefix || 'x'}-(.+)$`));
        this.directiveNameBuilder_ = (directiveNameBuilder || ((name, addDataPrefix = false) => {
            return (addDataPrefix ? `data-${this.directivePrefix_ || 'x'}-${name}` : `${this.directivePrefix_ || 'x'}-${name}`);
        }));
    }
    GetAppName() {
        return this.appName_;
    }
    SetDirectivePrefix(value) {
        this.directivePrefix_ = value;
        this.directiveRegex_ = new RegExp(`^(data-)?${value || 'x'}-(.+)$`);
    }
    GetDirectivePrefix() {
        return this.directivePrefix_;
    }
    SetElementPrefix(value) {
        this.elementPrefix_ = value;
    }
    GetElementPrefix() {
        return this.elementPrefix_;
    }
    GetDirectiveRegex() {
        return this.directiveRegex_;
    }
    GetDirectiveName(name, addDataPrefix) {
        return this.directiveNameBuilder_(name, addDataPrefix);
    }
    GetElementName(name) {
        return `${this.elementPrefix_ || this.directivePrefix_ || 'x'}-${name}`;
    }
    AddKeyEventMap(key, target) {
        this.keyMap_[key] = target;
    }
    RemoveKeyEventMap(key) {
        delete this.keyMap_[key];
    }
    MapKeyEvent(key) {
        return ((key in this.keyMap_) ? this.keyMap_[key] : key);
    }
    AddBooleanAttribute(name) {
        this.booleanAttributes_.push(name);
    }
    RemoveBooleanAttribute(name) {
        this.booleanAttributes_ = this.booleanAttributes_.filter(attr => (attr !== name));
    }
    IsBooleanAttribute(name) {
        return this.booleanAttributes_.includes(name);
    }
    SetReactiveState(state) {
        this.reactiveState_ = state;
    }
    GetReactiveState() {
        return this.reactiveState_;
    }
}
exports.Config = Config;
