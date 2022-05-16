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
let randomString = require("randomstring");
const create_1 = require("../global/create");
const attach_1 = require("../bootstrap/attach");
const data_1 = require("../directive/core/data/data");
const text_1 = require("../directive/core/flow/text");
const component_1 = require("../directive/core/data/component");
const component_2 = require("../magic/core/data/component");
const on_1 = require("../directive/core/flow/on");
const unoptimized_1 = require("../magic/core/reactive/unoptimized");
(0, mocha_1.describe)('component', () => {
    (0, mocha_1.it)('can be initialized with the \'x-component\' directive', () => {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data x-component="${key}">
                <span x-text="$name"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal(key);
    });
    (0, mocha_1.it)('can be initialized with the \'$config.name\' key during data initialization', () => {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ $config: { name: '${key}' } }">
                <span x-text="$name"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal(key);
    });
    (0, mocha_1.it)('can retrieve the current component name via the \'$name\' global magic property', () => {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ $config: { name: '${key}' } }">
                <span x-text="$name"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal(key);
    });
    (0, mocha_1.it)('can retrieve another component via the $component global magic property', () => {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }" x-component="${key}"></div>
            <div x-data>
                <span x-text="$component('${key}').foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
    });
    (0, mocha_1.it)('should ensure data retrieved from other components are reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }" x-component="${key}">
                <span x-text="foo"></span>
                <button x-on:click="foo = 'changed in ${key}'"></button>
            </div>
            <div x-data="{ foo: 'baz' }">
                <span x-text="foo"></span>
                <span x-text="$component('${key}').foo"></span>
                <button x-on:click="foo = 'unnamed changed'"></button>
                <button x-on:click="$component('${key}').foo = 'changed in unnamed'"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('baz');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('bar');
        user_event_1.default.click(document.querySelectorAll('button')[0]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal(`changed in ${key}`);
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('baz');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal(`changed in ${key}`);
        });
        user_event_1.default.click(document.querySelectorAll('button')[1]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal(`changed in ${key}`);
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('unnamed changed');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal(`changed in ${key}`);
        });
        user_event_1.default.click(document.querySelectorAll('button')[2]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('changed in unnamed');
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('unnamed changed');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('changed in unnamed');
        });
    }));
    (0, mocha_1.it)('should obey per region optimized setting when accessing data from other components', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'} }" x-component="${key}">
                <span x-text="nested.foo"></span>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
            <div x-data="{ $config: { reactiveState: 'unoptimized' } }">
                <span x-text="$component('${key}').nested.foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('unoptimized'); });
    }));
    (0, mocha_1.it)('should obey \'$unoptimized\' global magic property when accessing data from other components', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'} }" x-component="${key}">
                <span x-text="nested.foo"></span>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
            <div x-data>
                <span x-text="$unoptimized($component('${key}').nested.foo)"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, unoptimized_1.UnoptimizedMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('unoptimized'); });
    }));
    (0, mocha_1.it)('should not be affected by optimized settings in other components', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'} }" x-component="${key}">
                <span x-text="nested.foo"></span>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
            <div x-data="{ $config: { reactiveState: 'optimized' } }">
                <span x-text="$component('${key}').nested.foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('unoptimized'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar'); });
    }));
});
