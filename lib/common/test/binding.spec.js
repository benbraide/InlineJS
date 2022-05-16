"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const dom_1 = require("@testing-library/dom");
const user_event_1 = require("@testing-library/user-event");
const create_1 = require("../global/create");
const attach_1 = require("../bootstrap/attach");
const data_1 = require("../directive/core/data/data");
const text_1 = require("../directive/core/flow/text");
const on_1 = require("../directive/core/flow/on");
const unoptimized_1 = require("../magic/core/reactive/unoptimized");
const static_1 = require("../magic/core/reactive/static");
const effect_1 = require("../directive/core/reactive/effect");
const static_2 = require("../directive/core/reactive/static");
(0, mocha_1.describe)('data binding', () => {
    (0, mocha_1.it)('should work with data', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
    });
    (0, mocha_1.it)('should execute functions returned from expressions', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar', getFoo: () => foo, getFoo2(){ return this.foo }, nested: { baz: 'baz', getBaz(){ return this.baz } } }">
                <span x-text="getFoo"></span>
                <span x-text="getFoo2"></span>
                <span x-text="nested.getBaz"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz');
    });
    (0, mocha_1.it)('should be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz'); });
    }));
    (0, mocha_1.it)('should be unoptimized by default', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'} }">
                <span x-text="nested.foo"></span>
                <span x-text="nested"></span>
                <button x-on:click="nested.foo = 'baz'"></button>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('{"foo":"bar"}');
        user_event_1.default.click(document.querySelectorAll('button')[0]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('{"foo":"baz"}'); });
        user_event_1.default.click(document.querySelectorAll('button')[1]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('unoptimized'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('{"foo":"unoptimized"}'); });
    }));
    (0, mocha_1.it)('should obey global reactive settings', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'} }">
                <span x-text="nested.foo"></span>
                <span x-text="nested"></span>
                <button x-on:click="nested.foo = 'baz'"></button>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)().GetConfig().SetReactiveState('optimized');
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('{"foo":"bar"}');
        user_event_1.default.click(document.querySelectorAll('button')[0]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('{"foo":"baz"}'); });
        user_event_1.default.click(document.querySelectorAll('button')[1]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('{"foo":"unoptimized"}'); });
    }));
    (0, mocha_1.it)('should obey per component reactive settings', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'}, $config: {reactiveState: 'optimized'} }">
                <span x-text="nested.foo"></span>
                <span x-text="nested"></span>
                <button x-on:click="nested.foo = 'baz'"></button>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('{"foo":"bar"}');
        user_event_1.default.click(document.querySelectorAll('button')[0]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('{"foo":"baz"}'); });
        user_event_1.default.click(document.querySelectorAll('button')[1]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('{"foo":"unoptimized"}'); });
    }));
    (0, mocha_1.it)('should obey \'$unoptimized\' global magic property', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'}, $config: {reactiveState: 'optimized'} }">
                <span x-text="nested.foo"></span>
                <span x-text="$unoptimized(nested.foo)"></span>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, unoptimized_1.UnoptimizedMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('unoptimized'); });
    }));
    (0, mocha_1.it)('should obey \'$static\' global magic property', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <span x-text="$static(foo)"></span>
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, static_1.StaticMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar'); });
    }));
    (0, mocha_1.it)('should be reactive for \'x-effect\' directives', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{foo: 'bar'}">
                <template x-effect="computed = (foo + ' added')"></template>
                <span x-text="foo"></span>
                <span x-text="computed"></span>
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, effect_1.EffectDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar added');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('baz added'); });
    }));
    (0, mocha_1.it)('should not be reactive for \'x-static\' directives', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{foo: 'bar'}">
                <template x-static="computed = (foo + ' added')"></template>
                <span x-text="foo"></span>
                <span x-text="computed"></span>
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, static_2.StaticDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar added');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar added'); });
    }));
});
