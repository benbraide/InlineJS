import { expect } from 'chai'
import { describe, it } from 'mocha'
import { AddDirectiveExpansionRule, ApplyDirectiveExpansionRules, CreateDirectiveExpansionRule } from '../directive/expand';

import { CreateGlobal } from "../global/create";
import { BeginsWith } from '../utilities/begins-with';
import { EndsWith } from '../utilities/ends-with';

describe('expansion', () => {
    it('can be created from strings and regexes', () => {
        CreateGlobal();

        AddDirectiveExpansionRule(CreateDirectiveExpansionRule('@', 'hx-on:'));
        AddDirectiveExpansionRule(CreateDirectiveExpansionRule(BeginsWith(':'), 'hx-attr:'));
        AddDirectiveExpansionRule(CreateDirectiveExpansionRule(EndsWith('\\.'), '.default'));

        expect(ApplyDirectiveExpansionRules('hx-data')).equal('hx-data');
        expect(ApplyDirectiveExpansionRules(':name')).equal('hx-attr:name');
        expect(ApplyDirectiveExpansionRules(':name:key')).equal('hx-attr:name:key');
        expect(ApplyDirectiveExpansionRules('@click')).equal('hx-on:click');
        expect(ApplyDirectiveExpansionRules('hx-dir:key.opt.')).equal('hx-dir:key.opt.default');
    });

    it('can be added directly', () => {
        CreateGlobal();

        AddDirectiveExpansionRule(name => (name.startsWith('@') ? name.replace('@', 'hx-on:') : null));
        AddDirectiveExpansionRule(name => (name.startsWith(':') ? name.replace(':', 'hx-attr:') : null));
        AddDirectiveExpansionRule(name => (EndsWith('\\.').test(name) ? name.replace(EndsWith('\\.'), '.default') : null));

        expect(ApplyDirectiveExpansionRules('hx-data')).equal('hx-data');
        expect(ApplyDirectiveExpansionRules(':name')).equal('hx-attr:name');
        expect(ApplyDirectiveExpansionRules(':name:key')).equal('hx-attr:name:key');
        expect(ApplyDirectiveExpansionRules('@click')).equal('hx-on:click');
        expect(ApplyDirectiveExpansionRules('hx-dir:key.opt.')).equal('hx-dir:key.opt.default');
    });
});
