"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const create_1 = require("../global/create");
(0, mocha_1.describe)('config', () => {
    (0, mocha_1.it)('should match well-formed directives', () => {
        let config = (0, create_1.CreateGlobal)().GetConfig();
        (0, chai_1.expect)(config.GetDirectiveRegex().test('x-text')).equal(true);
        (0, chai_1.expect)(config.GetDirectiveRegex().test('data-x-text')).equal(true);
    });
    (0, mocha_1.it)('should not match malformed directives', () => {
        let config = (0, create_1.CreateGlobal)().GetConfig();
        (0, chai_1.expect)(config.GetDirectiveRegex().test('data-z-text')).equal(false);
        (0, chai_1.expect)(config.GetDirectiveRegex().test('z-text')).equal(false);
        (0, chai_1.expect)(config.GetDirectiveRegex().test('text')).equal(false);
    });
    (0, mocha_1.it)('should return well-formed directives from specified names', () => {
        let config = (0, create_1.CreateGlobal)().GetConfig();
        (0, chai_1.expect)(config.GetDirectiveName('text')).equal('x-text');
        (0, chai_1.expect)(config.GetDirectiveName('text', true)).equal('data-x-text');
    });
    (0, mocha_1.it)('should match well-formed directives with a changed directive prefix', () => {
        let config = (0, create_1.CreateGlobal)({ directivePrefix: 'z' }).GetConfig();
        (0, chai_1.expect)(config.GetDirectiveRegex().test('z-text')).equal(true);
        (0, chai_1.expect)(config.GetDirectiveRegex().test('data-z-text')).equal(true);
    });
    (0, mocha_1.it)('should not match malformed directives with a changed directive prefix', () => {
        let config = (0, create_1.CreateGlobal)({ directivePrefix: 'z' }).GetConfig();
        (0, chai_1.expect)(config.GetDirectiveRegex().test('data-x-text')).equal(false);
        (0, chai_1.expect)(config.GetDirectiveRegex().test('x-text')).equal(false);
        (0, chai_1.expect)(config.GetDirectiveRegex().test('text')).equal(false);
    });
    (0, mocha_1.it)('should return well-formed directives from specified names with a changed directive prefix', () => {
        let config = (0, create_1.CreateGlobal)({ directivePrefix: 'z' }).GetConfig();
        (0, chai_1.expect)(config.GetDirectiveName('text')).equal('z-text');
        (0, chai_1.expect)(config.GetDirectiveName('text', true)).equal('data-z-text');
    });
});
