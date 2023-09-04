"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJS = void 0;
const auto_1 = require("./bootstrap/auto");
const get_1 = require("./global/get");
const interpolation_1 = require("./global/interpolation");
const attach_1 = require("./bootstrap/attach");
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
const is_boolean_attribute_1 = require("./utilities/is-boolean-attribute");
const random_string_1 = require("./utilities/random-string");
const measure_callback_1 = require("./utilities/measure-callback");
const path_1 = require("./utilities/path");
const encode_attribute_1 = require("./utilities/encode-attribute");
const decode_attribute_1 = require("./utilities/decode-attribute");
const get_global_scope_1 = require("./utilities/get-global-scope");
const encode_value_1 = require("./utilities/encode-value");
const decode_value_1 = require("./utilities/decode-value");
const snake_case_1 = require("./utilities/snake-case");
const find_ancestor_1 = require("./utilities/find-ancestor");
const future_1 = require("./values/future");
const loop_1 = require("./values/loop");
const nothing_1 = require("./values/nothing");
const stack_1 = require("./stack");
const insert_html_1 = require("./component/insert-html");
function InlineJS() {
    (0, auto_1.AutoBootstrap)();
    (0, get_1.GetGlobal)().AddAttributeProcessor(interpolation_1.AttributeInterpolator);
    (0, get_1.GetGlobal)().AddTextContentProcessor(interpolation_1.TextContentInterpolator);
    (0, get_global_scope_1.InitializeGlobalScope)('', {
        waitForGlobal: get_1.WaitForGlobal,
        bootstrap: attach_1.BootstrapAndAttach,
    });
    (0, get_global_scope_1.InitializeGlobalScope)('utilities', {
        beginsWith: begins_with_1.BeginsWith,
        endsWith: ends_with_1.EndsWith,
        toCamelCase: camel_case_1.ToCamelCase,
        toSnakeCase: snake_case_1.ToSnakeCase,
        insertHtml: insert_html_1.InsertHtml,
        findAncestor: find_ancestor_1.FindAncestor,
        getAttribute: get_attribute_1.GetAttribute,
        findFirstAttribute: get_attribute_1.FindFirstAttribute,
        findFirstAttributeValue: get_attribute_1.FindFirstAttributeValue,
        setAttribute: set_attribute_1.SetAttributeUtil,
        isBooleanAttribute: is_boolean_attribute_1.IsBooleanAttribute,
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
        getRandomString: random_string_1.RandomString,
        measureCallback: measure_callback_1.MeasureCallback,
        encodeAttribute: encode_attribute_1.EncodeAttribute,
        decodeAttribute: decode_attribute_1.DecodeAttribute,
        encodeValue: encode_value_1.EncodeValue,
        decodeValue: decode_value_1.DecodeValue,
    });
    (0, get_global_scope_1.InitializeGlobalScope)('values', {
        future: future_1.Future,
        loop: loop_1.Loop,
        nothing: nothing_1.Nothing,
        stack: stack_1.Stack,
    });
    (0, get_global_scope_1.InitializeGlobalScope)('version', {
        major: 1,
        minor: 1,
        patch: 0,
        get value() {
            return `${this.major}.${this.minor}.${this.patch}`;
        },
        toString() {
            return this.value;
        },
    });
}
exports.InlineJS = InlineJS;
