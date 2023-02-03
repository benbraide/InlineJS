import { AutoBootstrap } from './bootstrap/auto';
import { GetGlobal, WaitForGlobal } from './global/get';
import { AttributeInterpolator, TextContentInterpolator } from './global/interpolation';

import { BeginsWith } from './utilities/begins-with';
import { EndsWith } from './utilities/ends-with';
import { ToCamelCase } from './utilities/camel-case';
import { GetAttribute } from './utilities/get-attribute';
import { SetAttributeUtil } from './utilities/set-attribute';
import { SupportsAttributes } from './utilities/supports-attributes';
import { GetTarget, GetTargets } from './utilities/get-target';
import { IsEqual } from './utilities/is-equal';
import { IsObject } from './utilities/is-object';
import { ToString } from './utilities/to-string';
import { DeepCopy } from './utilities/deep-copy';
import { TidyPath, PathToRelative, SplitPath, JoinPath } from './utilities/path';

import { Future } from './values/future';
import { Loop } from './values/loop';
import { Nothing } from './values/nothing';
import { Stack } from './stack';

export function InlineJS(){
    AutoBootstrap();

    GetGlobal().AddAttributeProcessor(AttributeInterpolator);
    GetGlobal().AddTextContentProcessor(TextContentInterpolator);

    let inlineScope = (globalThis['InlineJS'] = (globalThis['InlineJS'] || {}));

    inlineScope['waitForGlobal'] = WaitForGlobal;

    inlineScope['utilities'] = {
        beginsWith: BeginsWith,
        endsWith: EndsWith,
        toCamelCase: ToCamelCase,
        getAttribute: GetAttribute,
        setAttribute: SetAttributeUtil,
        supportsAttributes: SupportsAttributes,
        getTarget: GetTarget,
        getTargets: GetTargets,
        isEqual: IsEqual,
        isObject: IsObject,
        toString: ToString,
        deepCopy: DeepCopy,
        tidyPath: TidyPath,
        pathToRelative: PathToRelative,
        splitPath: SplitPath,
        joinPath: JoinPath,
        getRandomString: (length: number) => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            return Array.from({ length: length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        },
    };

    inlineScope['values'] = {
        future: Future,
        loop: Loop,
        nothing: Nothing,
        stack: Stack,
    };
}
