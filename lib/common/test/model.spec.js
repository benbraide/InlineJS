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
const model_1 = require("../directive/core/flow/model");
const on_1 = require("../directive/core/flow/on");
const get_1 = require("../global/get");
(0, mocha_1.describe)('x-model directive', () => {
    (0, mocha_1.it)('should have value binding when initialized', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <input x-model="foo">
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('bar');
    }));
    (0, mocha_1.it)('should update value when updated via input event', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <input x-model="foo">
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        user_event_1.default.clear(document.querySelector('input'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal(''); });
        user_event_1.default.type(document.querySelector('input'), 'baz');
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz'); });
    }));
    (0, mocha_1.it)('should reflect data changed elsewhere', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <input x-model="foo">
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('input').value).equal('baz'); });
    }));
    (0, mocha_1.it)('should cast value to number if \'.number\' modifier is present', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ $config: { name: '${key}' }, foo: null }">
                <input type="number" x-model.number="foo">
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        user_event_1.default.type(document.querySelector('input'), '123');
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)((0, get_1.GetGlobal)().FindComponentByName(key).GetRootProxy().GetNative()['foo']).equal(123); });
    }));
    (0, mocha_1.it)('should return original value if casting fails; numeric value if casting passes', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ $config: { name: '${key}' }, foo: 0, bar: '' }">
                <input type="number" x-model.number="foo">
                <input x-model.number="bar">
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        let proxy = (0, get_1.GetGlobal)().FindComponentByName(key).GetRootProxy().GetNative();
        user_event_1.default.clear(document.querySelectorAll('input')[0]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(proxy['foo']).equal(''); });
        user_event_1.default.type(document.querySelectorAll('input')[0], '-');
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(proxy['foo']).equal(''); });
        user_event_1.default.type(document.querySelectorAll('input')[0], '123');
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(proxy['foo']).equal(123); });
        user_event_1.default.clear(document.querySelectorAll('input')[1]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(proxy['bar']).equal(''); });
        user_event_1.default.type(document.querySelectorAll('input')[1], '-');
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(proxy['bar']).equal('-'); });
        user_event_1.default.type(document.querySelectorAll('input')[1], '123');
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(proxy['bar']).equal(-123); });
    }));
    (0, mocha_1.it)('should trim value if \'.trim\' modifier is present', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: '' }">
                <input x-model.trim="foo">
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        user_event_1.default.type(document.querySelector('input'), 'bar   ');
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
    }));
    (0, mocha_1.it)('should update value when updated via changed event when \'.lazy\' modifier is present', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <input x-model.lazy="foo">
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: 'baz' } });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        dom_1.fireEvent.change(document.querySelector('input'), { target: { value: 'baz' } });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz'); });
    }));
    (0, mocha_1.it)('should bind checkbox value', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: true }">
                <input type="checkbox" x-model="foo">
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').checked).equal(true);
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('true');
        user_event_1.default.click(document.querySelector('input'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('false'); });
    }));
    (0, mocha_1.it)('should bind checkbox value to array', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: ['bar'] }">
                <input type="checkbox" x-model="foo" value="bar">
                <input type="checkbox" x-model="foo" value="baz">
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('input')[0].checked).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('input')[1].checked).equal(false);
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('["bar"]');
        user_event_1.default.click(document.querySelectorAll('input')[1]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('input')[0].checked).equal(true);
            (0, chai_1.expect)(document.querySelectorAll('input')[1].checked).equal(true);
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('["bar","baz"]');
        });
    }));
    (0, mocha_1.it)('should support the \'.number\' modifier when binding checkbox value to array', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ selected: [2] }">
                <input type="checkbox" value="1" x-model.number="selected">
                <input type="checkbox" value="2" x-model.number="selected">
                <input type="checkbox" value="3" x-model.number="selected">
                <span x-text="selected"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('input')[0].checked).equal(false);
        (0, chai_1.expect)(document.querySelectorAll('input')[1].checked).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('input')[2].checked).equal(false);
        (0, chai_1.expect)(document.querySelector('span').textContent).equal("[2]");
        user_event_1.default.click(document.querySelectorAll('input')[2]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal("[2,3]"); });
        user_event_1.default.click(document.querySelectorAll('input')[0]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal("[2,3,1]"); });
        user_event_1.default.click(document.querySelectorAll('input')[0]);
        user_event_1.default.click(document.querySelectorAll('input')[1]);
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal("[3]"); });
    }));
    (0, mocha_1.it)('should bind radio value', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <input type="radio" x-model="foo" value="bar">
                <input type="radio" x-model="foo" value="baz">
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('input')[0].checked).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('input')[1].checked).equal(false);
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        user_event_1.default.click(document.querySelectorAll('input')[1]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('input')[0].checked).equal(false);
            (0, chai_1.expect)(document.querySelectorAll('input')[1].checked).equal(true);
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz');
        });
    }));
    (0, mocha_1.it)('should bind select dropdown', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <select x-model="foo">
                    <option disabled value="">Please select one</option>
                    <option>bar</option>
                    <option>baz</option>
                </select>
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('option')[0].selected).equal(false);
        (0, chai_1.expect)(document.querySelectorAll('option')[1].selected).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('option')[2].selected).equal(false);
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        dom_1.fireEvent.change(document.querySelector('select'), { target: { value: 'baz' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('option')[0].selected).equal(false);
            (0, chai_1.expect)(document.querySelectorAll('option')[1].selected).equal(false);
            (0, chai_1.expect)(document.querySelectorAll('option')[2].selected).equal(true);
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz');
        });
    }));
    (0, mocha_1.it)('should bind multiple select dropdown', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: ['bar'] }">
                <select x-model="foo" multiple>
                    <option disabled value="">Please select one</option>
                    <option value="bar">bar</option>
                    <option value="baz">baz</option>
                </select>
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('option')[0].selected).equal(false);
        (0, chai_1.expect)(document.querySelectorAll('option')[1].selected).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('option')[2].selected).equal(false);
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('["bar"]');
        user_event_1.default.selectOptions(document.querySelector('select'), ['bar', 'baz']);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('option')[0].selected).equal(false);
            (0, chai_1.expect)(document.querySelectorAll('option')[1].selected).equal(true);
            (0, chai_1.expect)(document.querySelectorAll('option')[2].selected).equal(true);
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('["bar","baz"]');
        });
    }));
    (0, mocha_1.it)('should bind nested keys', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ some: { nested: { key: 'foo' } } }">
                <input type="text" x-model="some.nested.key">
                <span x-text="some.nested.key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('foo');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: 'bar' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('bar');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        });
    }));
    (0, mocha_1.it)('should convert undefined nested model key to empty string by default', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ some: { nested: {} } }">
                <input type="text" x-model="some.nested.key">
                <span x-text="some.nested.key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: 'bar' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('bar');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        });
    }));
    (0, mocha_1.it)('should bind color input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: '#ff0000' }">
                <input type="color" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('#ff0000');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('#ff0000');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: '#00ff00' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('#00ff00');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('#00ff00');
        });
    }));
    (0, mocha_1.it)('should bind date input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: '2020-07-10' }">
                <input type="date" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('2020-07-10');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('2020-07-10');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: '2021-01-01' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('2021-01-01');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('2021-01-01');
        });
    }));
    (0, mocha_1.it)('should bind datetime-local input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: '2020-01-01T20:00' }">
                <input type="datetime-local" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('2020-01-01T20:00');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('2020-01-01T20:00');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: '2021-02-02T20:00' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('2021-02-02T20:00');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('2021-02-02T20:00');
        });
    }));
    (0, mocha_1.it)('should bind email input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: 'anon.legion@scope.ns' }">
                <input type="email" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('anon.legion@scope.ns');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('anon.legion@scope.ns');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: 'user.last@some.sp' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('user.last@some.sp');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('user.last@some.sp');
        });
    }));
    (0, mocha_1.it)('should bind month input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: '2020-04' }">
                <input type="month" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('2020-04');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('2020-04');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: '2021-05' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('2021-05');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('2021-05');
        });
    }));
    (0, mocha_1.it)('should bind number input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: '11' }">
                <input type="number" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('11');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('11');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: '2021' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('2021');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('2021');
        });
    }));
    (0, mocha_1.it)('should bind password input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: 'SecretKey' }">
                <input type="password" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('SecretKey');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('SecretKey');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: 'NewSecretKey' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('NewSecretKey');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('NewSecretKey');
        });
    }));
    (0, mocha_1.it)('should bind range input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: '10' }">
                <input type="range" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('10');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('10');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: '20' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('20');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('20');
        });
    }));
    (0, mocha_1.it)('should bind search input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: '' }">
                <input type="search" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: 'term' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('term');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('term');
        });
    }));
    (0, mocha_1.it)('should bind tel input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: '+12345678901' }">
                <input type="tel " x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('+12345678901');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('+12345678901');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: '+1239874560' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('+1239874560');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('+1239874560');
        });
    }));
    (0, mocha_1.it)('should bind time input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: '22:00' }">
                <input type="time" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('22:00');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('22:00');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: '23:00' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('23:00');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('23:00');
        });
    }));
    (0, mocha_1.it)('should bind week input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: '2020-W20' }">
                <input type="week" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('2020-W20');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('2020-W20');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: '2020-W30' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('2020-W30');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('2020-W30');
        });
    }));
    (0, mocha_1.it)('should bind url input', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ key: 'https://example.com' }">
                <input type="url" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, model_1.ModelDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('input').value).equal('https://example.com');
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('https://example.com');
        dom_1.fireEvent.input(document.querySelector('input'), { target: { value: 'https://whatismyip.com' } });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('input').value).equal('https://whatismyip.com');
            (0, chai_1.expect)(document.querySelector('span').textContent).equal('https://whatismyip.com');
        });
    }));
});
