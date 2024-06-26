"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveOptions = exports.ExtractDuration = void 0;
function ExtractDuration(value, defaultValue = 0) {
    const regex = /^[0-9]+(s|ms)?$/;
    if (!value || !value.match(regex)) {
        return defaultValue;
    }
    if (value.indexOf('m') == -1 && value.indexOf('s') != -1) { //Seconds
        return (parseInt(value) * 1000);
    }
    return parseInt(value);
}
exports.ExtractDuration = ExtractDuration;
function ResolveOptions({ options, list, defaultNumber, callback, unknownCallback }) {
    const resolvedOptions = (Array.isArray(options) ? options : [options]);
    const getDefaultNumber = (opt) => (((typeof defaultNumber === 'number') ? defaultNumber : (defaultNumber && defaultNumber(opt))) || 0);
    list.forEach((option, index) => {
        const matched = resolvedOptions.find(opt => (opt && option in opt));
        if (!matched) { //Not found
            return (unknownCallback && unknownCallback({ options, list, option, index }));
        }
        if ((!callback || callback({ options, list, option, index }) !== true)) {
            if (typeof matched[option] === 'number') {
                if (index < (list.length - 1)) {
                    matched[option] = ExtractDuration(list[index + 1].trim(), getDefaultNumber(option));
                }
                else {
                    matched[option] = getDefaultNumber(option);
                }
            }
            else if (typeof matched[option] === 'boolean') {
                matched[option] = true;
            }
        }
    });
    return options;
}
exports.ResolveOptions = ResolveOptions;
