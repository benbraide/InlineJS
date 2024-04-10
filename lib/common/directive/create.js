"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDirective = void 0;
const get_config_1 = require("../component/get-config");
const expand_1 = require("./expand");
let cachedMetas = {};
function CreateDirective(name, value, proxyAccessHandler) {
    if (!name || !(name = name.trim())) {
        return null;
    }
    if ((value = (value || '').trim()) === name) {
        value = '';
    }
    if (name in cachedMetas) { //Use cache
        return {
            meta: cachedMetas[name],
            value: value,
            proxyAccessHandler,
        };
    }
    const expandedName = (0, expand_1.ApplyDirectiveExpansionRules)(name), matches = expandedName.match((0, get_config_1.GetConfig)().GetDirectiveRegex());
    if (!matches || matches.length != 3 || !matches[2]) { //Not a directive
        return null;
    }
    const colonIndex = matches[2].indexOf(':');
    let parts = ((colonIndex == -1) ? [matches[2]] : [matches[2].substring(0, colonIndex), matches[2].substring(colonIndex + 1)]), nameValue = '', arg = '';
    if (parts.length > 1) {
        ([nameValue, arg] = parts);
    }
    else { //No arg key specified
        ([arg] = parts);
    }
    let argParts = arg.split('.'), argKey = '';
    if (nameValue) {
        argKey = argParts[0];
    }
    else { //No arg key specified
        nameValue = argParts[0];
    }
    argParts.splice(0, 1); //Delete first entry
    const nameParts = nameValue.split('-'), meta = {
        view: {
            original: name,
            expanded: expandedName,
        },
        name: {
            value: nameValue,
            joined: nameParts.join('.'),
            parts: nameParts,
        },
        arg: {
            key: argKey,
            options: (argParts || []),
        },
    };
    cachedMetas[name] = meta;
    return { meta, value, proxyAccessHandler };
}
exports.CreateDirective = CreateDirective;
