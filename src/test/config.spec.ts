import { expect } from 'chai'
import { describe, it } from 'mocha'
import { CreateGlobal } from '../global/create';

describe('config', () => {
    it('should match well-formed directives', () => {
        const config = CreateGlobal().GetConfig();
        expect(config.GetDirectiveRegex().test('hx-text')).equal(true);
        expect(config.GetDirectiveRegex().test('data-hx-text')).equal(true);
    });

    it('should not match malformed directives', () => {
        const config = CreateGlobal().GetConfig();
        expect(config.GetDirectiveRegex().test('data-z-text')).equal(false);
        expect(config.GetDirectiveRegex().test('z-text')).equal(false);
        expect(config.GetDirectiveRegex().test('text')).equal(false);
    });

    it('should return well-formed directives from specified names', () => {
        const config = CreateGlobal().GetConfig();
        expect(config.GetDirectiveName('text')).equal('hx-text');
        expect(config.GetDirectiveName('text', true)).equal('data-hx-text');
    });

    it('should match well-formed directives with a changed directive prefix', () => {
        const config = CreateGlobal({ directivePrefix: 'z' }).GetConfig();
        expect(config.GetDirectiveRegex().test('z-text')).equal(true);
        expect(config.GetDirectiveRegex().test('data-z-text')).equal(true);
    });

    it('should not match malformed directives with a changed directive prefix', () => {
        const config = CreateGlobal({ directivePrefix: 'z' }).GetConfig();
        expect(config.GetDirectiveRegex().test('data-hx-text')).equal(false);
        expect(config.GetDirectiveRegex().test('hx-text')).equal(false);
        expect(config.GetDirectiveRegex().test('text')).equal(false);
    });

    it('should return well-formed directives from specified names with a changed directive prefix', () => {
        const config = CreateGlobal({ directivePrefix: 'z' }).GetConfig();
        expect(config.GetDirectiveName('text')).equal('z-text');
        expect(config.GetDirectiveName('text', true)).equal('data-z-text');
    });
});
