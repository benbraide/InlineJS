import { expect } from 'chai'
import { describe, it } from 'mocha'

import { CreateGlobal } from '../global/create';
import { CreateDirective } from '../directive/create';

import { BindDirectiveExpansionRule } from '../expansion/bind';
import { ClassDirectiveExpansionRule } from '../expansion/class';
import { OnDirectiveExpansionRule } from '../expansion/on';

describe('directives parser', () => {
    it('should parse a well-formed directive', () => {
        CreateGlobal();
        
        let { meta, value } = (CreateDirective('x-text', '\'Hello world\'') || {});
        expect(meta?.name.value).equal('text');
        expect(value).equal('\'Hello world\'');

        ({ meta, value } = (CreateDirective('data-x-text', '\'Hello world\'') || {}));
        expect(meta?.name.value).equal('text');
        expect(value).equal('\'Hello world\'');
    });

    it('should not parse a malformed directive', () => {
        CreateGlobal();
        
        expect(CreateDirective('z-text', '\'Hello world\'')).equal(null);
        expect(CreateDirective('data-z-text', '\'Hello world\'')).equal(null);
    });

    it('should parse a directive with a specified argument key', () => {
        CreateGlobal();
        
        let { meta, value } = (CreateDirective('x-text:key', '\'Hello world\'') || {});
        expect(meta?.name.value).equal('text');
        expect(meta?.arg.key).equal('key');
        expect(value).equal('\'Hello world\'');
    });

    it('should parse a directive with specified argument options', () => {
        CreateGlobal();
        
        let { meta, value } = (CreateDirective('x-text.first.second', '\'Hello world\'') || {});
        expect(meta?.name.value).equal('text');
        expect(meta?.arg.options.join(',')).equal('first,second');
        expect(value).equal('\'Hello world\'');
    });

    it('should parse a directive with specified argument key and options', () => {
        CreateGlobal();
        
        let { meta, value } = (CreateDirective('x-text:key.first.second', '\'Hello world\'') || {});
        expect(meta?.name.value).equal('text');
        expect(meta?.arg.key).equal('key');
        expect(meta?.arg.options.join(',')).equal('first,second');
        expect(value).equal('\'Hello world\'');
    });

    it('should expand shorthands', () => {
        let global = CreateGlobal();

        global.GetDirectiveManager().AddExpansionRule(BindDirectiveExpansionRule);
        global.GetDirectiveManager().AddExpansionRule(ClassDirectiveExpansionRule);
        global.GetDirectiveManager().AddExpansionRule(OnDirectiveExpansionRule);
        
        let { meta, value } = (CreateDirective(':prop', 'value') || {});

        expect(meta?.name.value).equal('bind');
        expect(meta?.arg.key).equal('prop');
        expect(value).equal('value');

        ({ meta, value } = (CreateDirective('.name', 'value') || {}));
        expect(meta?.name.value).equal('class');
        expect(meta?.arg.key).equal('name');
        expect(value).equal('value');

        ({ meta, value } = (CreateDirective('@event', 'value') || {}));
        expect(meta?.name.value).equal('on');
        expect(meta?.arg.key).equal('event');
        expect(value).equal('value');
    });
});
