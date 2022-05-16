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
const each_1 = require("../directive/core/control/each");
const text_1 = require("../directive/core/flow/text");
const on_1 = require("../directive/core/flow/on");
const uninit_1 = require("../directive/core/lifecycle/uninit");
(0, mocha_1.describe)('x-each directive', () => {
    (0, mocha_1.it)('should work on arrays', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="['foo', 'bar']">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(2);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.foo.2');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
    });
    (0, mocha_1.it)('should support the \'as <name>\' syntax on arrays', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="['foo', 'bar'] as item">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(2);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.foo.foo.2');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.bar.bar.2');
    });
    (0, mocha_1.it)('should support the \'as <key> => <name>\' syntax on arrays', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="['foo', 'bar'] as key => item">
                    <p x-text="\`\${$each.index}.\${key}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(2);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.0.foo.foo.2');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.1.bar.bar.2');
    });
    (0, mocha_1.it)('should work on arrays of objects', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="[{ name: 'Anon', age: 27 }, { name: 'Legion', age: 99 }] as item">
                    <p x-text="\`\${item.name}.\${item.age}\`"></p>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(2);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('Anon.27');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('Legion.99');
    });
    (0, mocha_1.it)('should be reactive when array is replaced', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ list: ['foo'] }">
                <template x-each="list">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="list = ['foo', 'bar']"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.foo.1');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('p').length).equal(2);
            (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.foo.2');
            (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
        });
    }));
    (0, mocha_1.it)('should be reactive when array is manipulated', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ list: ['foo'] }">
                <template x-each="list">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="list.push('bar')"></button>
                <button x-on:click="list.unshift('first')"></button>
                <button x-on:click="list.splice(1, 1)"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.foo.1');
        user_event_1.default.click(document.querySelectorAll('button')[0]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('p').length).equal(2);
            (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.foo.2');
            (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
        });
        user_event_1.default.click(document.querySelectorAll('button')[1]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('p').length).equal(3);
            (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.first.3');
            (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.foo.3');
            (0, chai_1.expect)(document.querySelectorAll('p')[2].textContent).equal('2.bar.3');
        });
        user_event_1.default.click(document.querySelectorAll('button')[2]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('p').length).equal(2);
            (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.first.2');
            (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
        });
    }));
    (0, mocha_1.it)('should support the \'as <name>\' syntax and be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ list: ['foo'] }">
                <template x-each="list as item">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="list = ['foo', 'bar']"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.foo.foo.1');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('p').length).equal(2);
            (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.foo.foo.2');
            (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.bar.bar.2');
        });
    }));
    (0, mocha_1.it)('should remove all elements when array is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ list: ['foo'] }">
                <template x-each="list">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="list = []"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.foo.1');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('p').length).equal(0); });
    }));
    (0, mocha_1.it)('should optimize the creation of new nodes when coupled with a key', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ list: ['foo'], uninitCount: 0 }">
                <template x-each="list as index => item" :key="index">
                    <p x-text="item + '.' + $each.count" x-uninit="uninitCount += 1"></p>
                </template>
                <template x-each="list as item">
                    <p x-text="item" x-uninit="uninitCount += 1"></p>
                </template>
                <button x-on:click="list = ['foo', 'bar']"></button>
                <span x-text="uninitCount"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, uninit_1.UninitDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(2);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('foo.1');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('foo');
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('0');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('p').length).equal(4);
            (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('foo.2');
            (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('bar.2');
            (0, chai_1.expect)(document.querySelectorAll('p')[2].textContent).equal('foo');
            (0, chai_1.expect)(document.querySelectorAll('p')[3].textContent).equal('bar');
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('1');
        });
    }));
    (0, mocha_1.it)('should work on positive integer ranges', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="3">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(3);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.0.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.1.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[2].textContent).equal('2.2.3');
    });
    (0, mocha_1.it)('should work on positive integer ranges and be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ value: 3 }">
                <template x-each="value">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="value = 5"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(3);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.0.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.1.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[2].textContent).equal('2.2.3');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('p').length).equal(5);
            (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.0.5');
            (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.1.5');
            (0, chai_1.expect)(document.querySelectorAll('p')[2].textContent).equal('2.2.5');
            (0, chai_1.expect)(document.querySelectorAll('p')[3].textContent).equal('3.3.5');
            (0, chai_1.expect)(document.querySelectorAll('p')[4].textContent).equal('4.4.5');
        });
    }));
    (0, mocha_1.it)('should work on negative integer ranges', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="-3">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(3);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.-1.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.-2.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[2].textContent).equal('2.-3.3');
    });
    (0, mocha_1.it)('should work on negative integer ranges and be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ value: -3 }">
                <template x-each="value">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="value = -5"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(3);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.-1.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.-2.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[2].textContent).equal('2.-3.3');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('p').length).equal(5);
            (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('0.-1.5');
            (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('1.-2.5');
            (0, chai_1.expect)(document.querySelectorAll('p')[2].textContent).equal('2.-3.5');
            (0, chai_1.expect)(document.querySelectorAll('p')[3].textContent).equal('3.-4.5');
            (0, chai_1.expect)(document.querySelectorAll('p')[4].textContent).equal('4.-5.5');
        });
    }));
    (0, mocha_1.it)('should work on key-value pairs', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="{ name: 'John Doe', age: 36, gender: 'MALE' }">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(3);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('name.John Doe.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('age.36.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[2].textContent).equal('gender.MALE.3');
    });
    (0, mocha_1.it)('should support the \'as <name>\' syntax on key-value pairs', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="{ name: 'John Doe', age: 36, gender: 'MALE' } as item">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(3);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('name.John Doe.John Doe.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[1].textContent).equal('age.36.36.3');
        (0, chai_1.expect)(document.querySelectorAll('p')[2].textContent).equal('gender.MALE.MALE.3');
    });
    (0, mocha_1.it)('should contain reactive elements', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ items: ['first'], foo: 'bar' }">
                <button x-on:click="foo = 'baz'"></button>
                <template x-each="items">
                    <section>
                        <h1 x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></h1>
                        <h2 x-text="foo"></h2>
                    </section>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('section').length).equal(1);
        (0, chai_1.expect)(document.querySelector('h1').textContent).equal('0.first.1');
        (0, chai_1.expect)(document.querySelector('h2').textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('0.first.1');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('baz');
        });
    }));
    (0, mocha_1.it)('can be nested', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ $enableOptimizedBinds: false, foos: [ { bars: ['bob', 'lob'] } ] }">
                <button x-on:click="foos = [ { bars: ['bob', 'lob'] }, { bars: ['law'] } ]"></button>
                <template x-each="foos">
                    <template x-each="$each.value.bars">
                        <span x-text="$each.value"></span>
                    </template>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span').length).equal(2); });
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bob');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('lob');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span').length).equal(3); });
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bob');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('lob');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('law');
    }));
    (0, mocha_1.it)('should be able to access parent data when nested', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foos: [ {name: 'foo', bars: ['bob', 'lob']}, {name: 'baz', bars: ['bab', 'lab']} ] }">
                <template x-each="foos">
                    <template x-each="$each.value.bars">
                        <span x-text="$each.parent.value.name+': '+$each.value"></span>
                    </template>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span').length).equal(4); });
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo: bob');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('foo: lob');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz: bab');
        (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz: lab');
    }));
    (0, mocha_1.it)('should support the \'as <name>\' syntax and be able to access parent data when nested', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foos: [ {name: 'foo', bars: ['bob', 'lob']}, {name: 'baz', bars: ['bab', 'lab']} ] }">
                <template x-each="foos as foo">
                    <template x-each="foo.bars as bar">
                        <span x-text="foo.name+': '+bar"></span>
                    </template>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span').length).equal(4); });
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo: bob');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('foo: lob');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz: bab');
        (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz: lab');
    }));
    (0, mocha_1.it)('should be able to handle nested event listeners', () => __awaiter(void 0, void 0, void 0, function* () {
        document['_alerts'] = [];
        document.body.innerHTML = `
            <div x-data="{ foos: [
                {name: 'foo', bars: [{name: 'bob', count: 0}, {name: 'lob', count: 0}]},
                {name: 'baz', bars: [{name: 'bab', count: 0}, {name: 'lab', count: 0}]}
            ], fnText: function(foo, bar) { return foo.name+': '+bar.name+' = '+bar.count; }, onClick: function(foo, bar){ bar.count += 1; document._alerts.push(this.fnText(foo, bar)) } }">
                <template x-each="foos">
                    <template x-each="$each.value.bars">
                        <span x-text="fnText($each.parent.value, $each.value)" x-on:click="onClick($each.parent.value, $each.value)" ></span>
                    </template>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span').length).equal(4); });
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 0');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
        (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
        (0, chai_1.expect)(document['_alerts'].length).equal(0);
        user_event_1.default.click(document.querySelectorAll('span')[0]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
            (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
            (0, chai_1.expect)(document['_alerts'].length).equal(1);
            (0, chai_1.expect)(document['_alerts'][0]).equal('foo: bob = 1');
        });
        user_event_1.default.click(document.querySelectorAll('span')[2]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
            (0, chai_1.expect)(document['_alerts'].length).equal(2);
            (0, chai_1.expect)(document['_alerts'][0]).equal('foo: bob = 1');
            (0, chai_1.expect)(document['_alerts'][1]).equal('baz: bab = 1');
        });
        user_event_1.default.click(document.querySelectorAll('span')[0]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 2');
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
            (0, chai_1.expect)(document['_alerts'].length).equal(3);
            (0, chai_1.expect)(document['_alerts'][0]).equal('foo: bob = 1');
            (0, chai_1.expect)(document['_alerts'][1]).equal('baz: bab = 1');
            (0, chai_1.expect)(document['_alerts'][2]).equal('foo: bob = 2');
        });
    }));
    (0, mocha_1.it)('should support the \'as <name>\' syntax and be able to handle nested event listeners', () => __awaiter(void 0, void 0, void 0, function* () {
        document['_alerts'] = [];
        document.body.innerHTML = `
            <div x-data="{ foos: [
                {name: 'foo', bars: [{name: 'bob', count: 0}, {name: 'lob', count: 0}]},
                {name: 'baz', bars: [{name: 'bab', count: 0}, {name: 'lab', count: 0}]}
            ], fnText: function(foo, bar) { return foo.name+': '+bar.name+' = '+bar.count; }, onClick: function(foo, bar){ bar.count += 1; document._alerts.push(this.fnText(foo, bar)) } }">
                <template x-each="foos as foo">
                    <template x-each="foo.bars as bar">
                        <span x-text="fnText(foo, bar)" x-on:click="onClick(foo, bar)" ></span>
                    </template>
                </template>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span').length).equal(4); });
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 0');
        (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
        (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
        (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
        (0, chai_1.expect)(document['_alerts'].length).equal(0);
        user_event_1.default.click(document.querySelectorAll('span')[0]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
            (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
            (0, chai_1.expect)(document['_alerts'].length).equal(1);
            (0, chai_1.expect)(document['_alerts'][0]).equal('foo: bob = 1');
        });
        user_event_1.default.click(document.querySelectorAll('span')[2]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
            (0, chai_1.expect)(document['_alerts'].length).equal(2);
            (0, chai_1.expect)(document['_alerts'][0]).equal('foo: bob = 1');
            (0, chai_1.expect)(document['_alerts'][1]).equal('baz: bab = 1');
        });
        user_event_1.default.click(document.querySelectorAll('span')[0]);
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 2');
            (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            (0, chai_1.expect)(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
            (0, chai_1.expect)(document['_alerts'].length).equal(3);
            (0, chai_1.expect)(document['_alerts'][0]).equal('foo: bob = 1');
            (0, chai_1.expect)(document['_alerts'][1]).equal('baz: bab = 1');
            (0, chai_1.expect)(document['_alerts'][2]).equal('foo: bob = 2');
        });
    }));
});
