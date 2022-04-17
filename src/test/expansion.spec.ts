import { expect } from 'chai'
import { describe, it } from 'mocha'
import { AddDirectiveExpansionRule, ApplyDirectiveExpansionRules, CreateDirectiveExpansionRule } from '../directive/expand';

import { CreateGlobal } from "../global/create";
import { BeginsWith } from '../utilities/begins-with';
import { EndsWith } from '../utilities/ends-with';

describe('expansion', () => {
    it('can be created from strings and regexes', () => {
        CreateGlobal();

        AddDirectiveExpansionRule(CreateDirectiveExpansionRule('@', 'x-on:'));
        AddDirectiveExpansionRule(CreateDirectiveExpansionRule(BeginsWith(':'), 'x-attr:'));
        AddDirectiveExpansionRule(CreateDirectiveExpansionRule(EndsWith('\\.'), '.default'));

        expect(ApplyDirectiveExpansionRules('x-data')).equal('x-data');
        expect(ApplyDirectiveExpansionRules(':name')).equal('x-attr:name');
        expect(ApplyDirectiveExpansionRules(':name:key')).equal('x-attr:name:key');
        expect(ApplyDirectiveExpansionRules('@click')).equal('x-on:click');
        expect(ApplyDirectiveExpansionRules('x-dir:key.opt.')).equal('x-dir:key.opt.default');
    });

    it('can be added directly', () => {
        CreateGlobal();

        AddDirectiveExpansionRule(name => (name.startsWith('@') ? name.replace('@', 'x-on:') : null));
        AddDirectiveExpansionRule(name => (name.startsWith(':') ? name.replace(':', 'x-attr:') : null));
        AddDirectiveExpansionRule(name => (EndsWith('\\.').test(name) ? name.replace(EndsWith('\\.'), '.default') : null));

        expect(ApplyDirectiveExpansionRules('x-data')).equal('x-data');
        expect(ApplyDirectiveExpansionRules(':name')).equal('x-attr:name');
        expect(ApplyDirectiveExpansionRules(':name:key')).equal('x-attr:name:key');
        expect(ApplyDirectiveExpansionRules('@click')).equal('x-on:click');
        expect(ApplyDirectiveExpansionRules('x-dir:key.opt.')).equal('x-dir:key.opt.default');
    });
});
