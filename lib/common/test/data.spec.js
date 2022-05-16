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
const get_1 = require("../global/get");
const on_1 = require("../directive/core/flow/on");
const unoptimized_1 = require("../magic/core/reactive/unoptimized");
(0, mocha_1.describe)('x-data directive', () => {
    (0, mocha_1.it)('should be reactive when manipulated on component object', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ $config: { name: '${key}' }, foo: 'bar' }">
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        (0, get_1.GetGlobal)().FindComponentByName(key).GetRootProxy().GetNative()['foo'] = 'baz';
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz'); });
    }));
    (0, mocha_1.it)('should have an optional attribute value', () => {
        document.body.innerHTML = `
            <div x-data>
                <span x-text="'foo'"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo');
    });
    (0, mocha_1.it)('can use \'this\'', () => {
        document.body.innerHTML = `
            <div x-data="{ text: this.dataset.text }" data-text="test">
              <span x-text="text"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('test');
    });
    (0, mocha_1.it)('should contain reactive functions', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar', getFoo() {return this.foo}}">
                <span x-text="getFoo()"></span>
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
    (0, mocha_1.it)('can be nested as scopes', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
              <span x-text="foo"></span>
              <span x-text="$scope.foo"></span>
              <div x-data="{ foo: 'baz', other: 'value' }">
                <span x-text="foo"></span>
                <span x-text="$scope.foo"></span>
                <span x-text="$scope.other"></span>
                <span x-text="$parent.foo"></span>
              </div>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz');
        (0, chai_1.expect)(document.querySelectorAll('span')[4].textContent).equal('value');
        (0, chai_1.expect)(document.querySelectorAll('span')[5].textContent).equal('bar');
    });
    (0, mocha_1.it)('should contain reactive scopes', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <div x-data="{ foo: 'baz' }">
                    <span x-text="foo"></span>
                    <span x-text="$scope.foo"></span>
                    <button x-on:click="$scope.foo = 'changed'"></button>
                </div>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('bar');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('changed');
        });
    }));
    (0, mocha_1.it)('should not nest and duplicate proxies when manipulating an array', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ list: [ {name: 'foo'}, {name: 'bar'} ] }">
                <span x-text="$unoptimized(list[0].name)"></span>
                <button x-on:click="list.sort((a, b) => (a.name > b.name) ? 1 : -1)"></button>
                <h1 x-on:click="list.sort((a, b) => (a.name < b.name) ? 1 : -1)"></h1>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, unoptimized_1.UnoptimizedMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
    }));
    (0, mocha_1.it)('should refresh one time per update whatever the number of mutations in the update', () => __awaiter(void 0, void 0, void 0, function* () {
        globalThis['refreshCount'] = 0;
        document.body.innerHTML = `
            <div x-data="{ items: ['foo', 'bar'], qux: 'quux', test() {this.items; this.qux; return ++globalThis.refreshCount} }">
                <span x-text="test()"></span>
                <button x-on:click="(() => { items.push('baz'); qux = 'corge'; })()"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(globalThis['refreshCount']).equal(1);
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(globalThis['refreshCount']).equal(2); });
    }));
});
