import { BeginsWith } from '../utilities/begins-with';
import { EndsWith } from '../utilities/ends-with';
import { ToCamelCase } from '../utilities/camel-case';
import { FindFirstAttribute, FindFirstAttributeValue, GetAttribute } from '../utilities/get-attribute';
import { SetAttributeUtil } from '../utilities/set-attribute';
import { SupportsAttributes } from '../utilities/supports-attributes';
import { GetTarget, GetTargets } from '../utilities/get-target';
import { IsEqual } from '../utilities/is-equal';
import { IsObject } from '../utilities/is-object';
import { ToString } from '../utilities/to-string';
import { DeepCopy } from '../utilities/deep-copy';
import { MergeObjects } from '../utilities/merge-objects';
import { IsBooleanAttribute } from '../utilities/is-boolean-attribute';
import { RandomString } from '../utilities/random-string';
import { MeasureCallback } from '../utilities/measure-callback';
import { TidyPath, PathToRelative, SplitPath, JoinPath } from '../utilities/path';
import { EncodeAttribute } from '../utilities/encode-attribute';
import { DecodeAttribute } from '../utilities/decode-attribute';
import { InitializeGlobalScope } from '../utilities/get-global-scope';
import { EncodeValue } from '../utilities/encode-value';
import { DecodeValue } from '../utilities/decode-value';
import { ToSnakeCase } from '../utilities/snake-case';
import { FindAncestor } from '../utilities/find-ancestor';
import { InsertHtml } from '../component/insert-html';
import { IsInsideTemplate, IsTemplate } from '../utilities/template';
import { IsCustomElement } from '../utilities/is-custom-element';
export function InitializeUtilities() {
    InitializeGlobalScope('utilities', {
        beginsWith: BeginsWith,
        endsWith: EndsWith,
        toCamelCase: ToCamelCase,
        toSnakeCase: ToSnakeCase,
        insertHtml: InsertHtml,
        findAncestor: FindAncestor,
        getAttribute: GetAttribute,
        findFirstAttribute: FindFirstAttribute,
        findFirstAttributeValue: FindFirstAttributeValue,
        setAttribute: SetAttributeUtil,
        isBooleanAttribute: IsBooleanAttribute,
        supportsAttributes: SupportsAttributes,
        getTarget: GetTarget,
        getTargets: GetTargets,
        isEqual: IsEqual,
        isObject: IsObject,
        isCustomElement: IsCustomElement,
        toString: ToString,
        deepCopy: DeepCopy,
        mergeObjects: MergeObjects,
        tidyPath: TidyPath,
        pathToRelative: PathToRelative,
        splitPath: SplitPath,
        joinPath: JoinPath,
        getRandomString: RandomString,
        measureCallback: MeasureCallback,
        encodeAttribute: EncodeAttribute,
        decodeAttribute: DecodeAttribute,
        encodeValue: EncodeValue,
        decodeValue: DecodeValue,
        isTemplate: IsTemplate,
        isInsideTemplate: IsInsideTemplate,
    });
}
