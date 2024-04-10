"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const expand_1 = require("../directive/expand");
const create_1 = require("../global/create");
const begins_with_1 = require("../utilities/begins-with");
const ends_with_1 = require("../utilities/ends-with");
(0, mocha_1.describe)('expansion', () => {
    (0, mocha_1.it)('can be created from strings and regexes', () => {
        (0, create_1.CreateGlobal)();
        (0, expand_1.AddDirectiveExpansionRule)((0, expand_1.CreateDirectiveExpansionRule)('@', 'hx-on:'));
        (0, expand_1.AddDirectiveExpansionRule)((0, expand_1.CreateDirectiveExpansionRule)((0, begins_with_1.BeginsWith)(':'), 'hx-attr:'));
        (0, expand_1.AddDirectiveExpansionRule)((0, expand_1.CreateDirectiveExpansionRule)((0, ends_with_1.EndsWith)('\\.'), '.default'));
        (0, chai_1.expect)((0, expand_1.ApplyDirectiveExpansionRules)('hx-data')).equal('hx-data');
        (0, chai_1.expect)((0, expand_1.ApplyDirectiveExpansionRules)(':name')).equal('hx-attr:name');
        (0, chai_1.expect)((0, expand_1.ApplyDirectiveExpansionRules)(':name:key')).equal('hx-attr:name:key');
        (0, chai_1.expect)((0, expand_1.ApplyDirectiveExpansionRules)('@click')).equal('hx-on:click');
        (0, chai_1.expect)((0, expand_1.ApplyDirectiveExpansionRules)('hx-dir:key.opt.')).equal('hx-dir:key.opt.default');
    });
    (0, mocha_1.it)('can be added directly', () => {
        (0, create_1.CreateGlobal)();
        (0, expand_1.AddDirectiveExpansionRule)(name => (name.startsWith('@') ? name.replace('@', 'hx-on:') : null));
        (0, expand_1.AddDirectiveExpansionRule)(name => (name.startsWith(':') ? name.replace(':', 'hx-attr:') : null));
        (0, expand_1.AddDirectiveExpansionRule)(name => ((0, ends_with_1.EndsWith)('\\.').test(name) ? name.replace((0, ends_with_1.EndsWith)('\\.'), '.default') : null));
        (0, chai_1.expect)((0, expand_1.ApplyDirectiveExpansionRules)('hx-data')).equal('hx-data');
        (0, chai_1.expect)((0, expand_1.ApplyDirectiveExpansionRules)(':name')).equal('hx-attr:name');
        (0, chai_1.expect)((0, expand_1.ApplyDirectiveExpansionRules)(':name:key')).equal('hx-attr:name:key');
        (0, chai_1.expect)((0, expand_1.ApplyDirectiveExpansionRules)('@click')).equal('hx-on:click');
        (0, chai_1.expect)((0, expand_1.ApplyDirectiveExpansionRules)('hx-dir:key.opt.')).equal('hx-dir:key.opt.default');
    });
});
