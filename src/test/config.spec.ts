import { expect } from 'chai'
import { describe, it } from 'mocha'
import { CreateGlobal } from '../global/create';

describe('config', () => {
    it('should match well-formed directives', () => {
        let config = CreateGlobal().GetConfig();
        expect(config.GetDirectiveRegex().test('x-text')).equal(true);
        expect(config.GetDirectiveRegex().test('data-x-text')).equal(true);
    });

    it('should not match malformed directives', () => {
        let config = CreateGlobal().GetConfig();
        expect(config.GetDirectiveRegex().test('data-z-text')).equal(false);
        expect(config.GetDirectiveRegex().test('z-text')).equal(false);
        expect(config.GetDirectiveRegex().test('text')).equal(false);
    });

    it('should return well-formed directives from specified names', () => {
        let config = CreateGlobal().GetConfig();
        expect(config.GetDirectiveName('text')).equal('x-text');
        expect(config.GetDirectiveName('text', true)).equal('data-x-text');
    });

    it('should match well-formed directives with a changed directive prefix', () => {
        let config = CreateGlobal({ directivePrefix: 'z' }).GetConfig();
        expect(config.GetDirectiveRegex().test('z-text')).equal(true);
        expect(config.GetDirectiveRegex().test('data-z-text')).equal(true);
    });

    it('should not match malformed directives with a changed directive prefix', () => {
        let config = CreateGlobal({ directivePrefix: 'z' }).GetConfig();
        expect(config.GetDirectiveRegex().test('data-x-text')).equal(false);
        expect(config.GetDirectiveRegex().test('x-text')).equal(false);
        expect(config.GetDirectiveRegex().test('text')).equal(false);
    });

    it('should return well-formed directives from specified names with a changed directive prefix', () => {
        let config = CreateGlobal({ directivePrefix: 'z' }).GetConfig();
        expect(config.GetDirectiveName('text')).equal('z-text');
        expect(config.GetDirectiveName('text', true)).equal('data-z-text');
    });
});
