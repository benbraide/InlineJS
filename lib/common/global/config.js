"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const get_global_scope_1 = require("../utilities/get-global-scope");
const merge_objects_1 = require("../utilities/merge-objects");
class Config {
    constructor(options_) {
        this.options_ = options_;
        this.defaultOptions_ = {
            reactiveState: 'unoptimized',
            directivePrefix: 'hx',
        };
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
        this.options_ = (0, merge_objects_1.MergeObjects)(Object.assign({}, (0, get_global_scope_1.GetGlobalScope)('config', true)), (0, merge_objects_1.MergeObjects)(this.options_, this.defaultOptions_));
        this.UpdateDirectiveRegex_();
        if (!this.options_.directiveNameBuilder) {
            const options = this.options_;
            options.directiveNameBuilder = ((name, addDataPrefix = false) => {
                const prefix = options.directivePrefix || options.directivePrefix || 'hx';
                return (addDataPrefix ? `data-${prefix}-${name}` : `${prefix}-${name}`);
            });
        }
    }
    GetAppName() {
        return this.options_.appName || '';
    }
    SetDirectivePrefix(value) {
        this.options_.directivePrefix = value;
        this.UpdateDirectiveRegex_();
    }
    GetDirectivePrefix() {
        return this.options_.directivePrefix || this.defaultOptions_.directivePrefix || 'hx';
    }
    SetElementPrefix(value) {
        this.options_.elementPrefix = value;
    }
    GetElementPrefix() {
        return this.options_.elementPrefix || this.GetDirectivePrefix();
    }
    GetDirectiveRegex() {
        return this.options_.directiveRegex || this.UpdateDirectiveRegex_();
    }
    GetDirectiveName(name, addDataPrefix) {
        return (this.options_.directiveNameBuilder ? this.options_.directiveNameBuilder(name, addDataPrefix) : name);
    }
    GetElementName(name) {
        return `${this.GetElementPrefix()}-${name}`;
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
        this.options_.reactiveState = state;
    }
    GetReactiveState() {
        return this.options_.reactiveState || this.defaultOptions_.reactiveState || 'unoptimized';
    }
    SetUseGlobalWindow(value) {
        this.options_.useGlobalWindow = value;
    }
    GetUseGlobalWindow() {
        return this.options_.useGlobalWindow || false;
    }
    UpdateDirectiveRegex_() {
        return (this.options_.directiveRegex = (this.options_.directiveRegex || new RegExp(`^(data-)?${this.GetDirectivePrefix()}-(.+)$`)));
    }
    SetWrapScopedFunctions(value) {
        this.options_.wrapScopedFunctions = value;
    }
    GetWrapScopedFunctions() {
        return this.options_.wrapScopedFunctions || false;
    }
}
exports.Config = Config;
