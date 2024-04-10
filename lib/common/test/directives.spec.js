"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const create_1 = require("../global/create");
const create_2 = require("../directive/create");
const bind_1 = require("../expansion/bind");
const class_1 = require("../expansion/class");
const on_1 = require("../expansion/on");
(0, mocha_1.describe)('directives parser', () => {
    (0, mocha_1.it)('should parse a well-formed directive', () => {
        (0, create_1.CreateGlobal)();
        let { meta, value } = ((0, create_2.CreateDirective)('hx-text', '\'Hello world\'') || {});
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.name.value).equal('text');
        (0, chai_1.expect)(value).equal('\'Hello world\'');
        ({ meta, value } = ((0, create_2.CreateDirective)('data-hx-text', '\'Hello world\'') || {}));
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.name.value).equal('text');
        (0, chai_1.expect)(value).equal('\'Hello world\'');
    });
    (0, mocha_1.it)('should not parse a malformed directive', () => {
        (0, create_1.CreateGlobal)();
        (0, chai_1.expect)((0, create_2.CreateDirective)('z-text', '\'Hello world\'')).equal(null);
        (0, chai_1.expect)((0, create_2.CreateDirective)('data-z-text', '\'Hello world\'')).equal(null);
    });
    (0, mocha_1.it)('should parse a directive with a specified argument key', () => {
        (0, create_1.CreateGlobal)();
        const { meta, value } = ((0, create_2.CreateDirective)('hx-text:key', '\'Hello world\'') || {});
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.name.value).equal('text');
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.arg.key).equal('key');
        (0, chai_1.expect)(value).equal('\'Hello world\'');
    });
    (0, mocha_1.it)('should parse a directive with specified argument options', () => {
        (0, create_1.CreateGlobal)();
        const { meta, value } = ((0, create_2.CreateDirective)('hx-text.first.second', '\'Hello world\'') || {});
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.name.value).equal('text');
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.arg.options.join(',')).equal('first,second');
        (0, chai_1.expect)(value).equal('\'Hello world\'');
    });
    (0, mocha_1.it)('should parse a directive with specified argument key and options', () => {
        (0, create_1.CreateGlobal)();
        const { meta, value } = ((0, create_2.CreateDirective)('hx-text:key.first.second', '\'Hello world\'') || {});
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.name.value).equal('text');
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.arg.key).equal('key');
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.arg.options.join(',')).equal('first,second');
        (0, chai_1.expect)(value).equal('\'Hello world\'');
    });
    (0, mocha_1.it)('should expand shorthands', () => {
        const global = (0, create_1.CreateGlobal)();
        global.GetDirectiveManager().AddExpansionRule(bind_1.BindDirectiveExpansionRule);
        global.GetDirectiveManager().AddExpansionRule(class_1.ClassDirectiveExpansionRule);
        global.GetDirectiveManager().AddExpansionRule(on_1.OnDirectiveExpansionRule);
        let { meta, value } = ((0, create_2.CreateDirective)(':prop', 'value') || {});
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.name.value).equal('bind');
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.arg.key).equal('prop');
        (0, chai_1.expect)(value).equal('value');
        ({ meta, value } = ((0, create_2.CreateDirective)('.name', 'value') || {}));
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.name.value).equal('class');
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.arg.key).equal('name');
        (0, chai_1.expect)(value).equal('value');
        ({ meta, value } = ((0, create_2.CreateDirective)('@event', 'value') || {}));
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.name.value).equal('on');
        (0, chai_1.expect)(meta === null || meta === void 0 ? void 0 : meta.arg.key).equal('event');
        (0, chai_1.expect)(value).equal('value');
    });
});
