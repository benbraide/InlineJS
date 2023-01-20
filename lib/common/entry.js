"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJS = void 0;
const auto_1 = require("./bootstrap/auto");
const get_1 = require("./global/get");
const interpolation_1 = require("./global/interpolation");
const begins_with_1 = require("./utilities/begins-with");
const ends_with_1 = require("./utilities/ends-with");
const camel_case_1 = require("./utilities/camel-case");
const get_attribute_1 = require("./utilities/get-attribute");
const set_attribute_1 = require("./utilities/set-attribute");
const supports_attributes_1 = require("./utilities/supports-attributes");
const get_target_1 = require("./utilities/get-target");
const is_equal_1 = require("./utilities/is-equal");
const is_object_1 = require("./utilities/is-object");
const to_string_1 = require("./utilities/to-string");
const deep_copy_1 = require("./utilities/deep-copy");
const path_1 = require("./utilities/path");
const future_1 = require("./values/future");
const loop_1 = require("./values/loop");
const nothing_1 = require("./values/nothing");
const stack_1 = require("./stack");
function InlineJS() {
    (0, auto_1.AutoBootstrap)();
    (0, get_1.GetGlobal)().AddAttributeProcessor(interpolation_1.AttributeInterpolator);
    (0, get_1.GetGlobal)().AddTextContentProcessor(interpolation_1.TextContentInterpolator);
    let inlineScope = (globalThis['InlineJS'] = (globalThis['InlineJS'] || {}));
    inlineScope['utilities'] = {
        beginsWith: begins_with_1.BeginsWith,
        endsWith: ends_with_1.EndsWith,
        toCamelCase: camel_case_1.ToCamelCase,
        getAttribute: get_attribute_1.GetAttribute,
        setAttribute: set_attribute_1.SetAttributeUtil,
        supportsAttributes: supports_attributes_1.SupportsAttributes,
        getTarget: get_target_1.GetTarget,
        getTargets: get_target_1.GetTargets,
        isEqual: is_equal_1.IsEqual,
        isObject: is_object_1.IsObject,
        toString: to_string_1.ToString,
        deepCopy: deep_copy_1.DeepCopy,
        tidyPath: path_1.TidyPath,
        pathToRelative: path_1.PathToRelative,
        splitPath: path_1.SplitPath,
        joinPath: path_1.JoinPath,
        getRandomString: (length) => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            return Array.from({ length: length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        },
    };
    inlineScope['values'] = {
        future: future_1.Future,
        loop: loop_1.Loop,
        nothing: nothing_1.Nothing,
        stack: stack_1.Stack,
    };
}
exports.InlineJS = InlineJS;
