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
const if_1 = require("../directive/core/control/if");
const on_1 = require("../directive/core/flow/on");
const text_1 = require("../directive/core/flow/text");
const each_1 = require("../directive/core/control/each");
const else_1 = require("../directive/core/control/else");
(0, mocha_1.describe)('x-if directive', () => {
    (0, mocha_1.it)('should create element on truthy value', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ show: true }">
                <template x-if="show">
                    <p></p>
                </template>
            </div>
        `;
        (0, create_1.GetOrCreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, if_1.IfDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1);
    }));
    (0, mocha_1.it)('should not create element on falsy value', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ show: false }">
                <template x-if="show">
                    <p></p>
                </template>
            </div>
        `;
        (0, create_1.GetOrCreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, if_1.IfDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(0);
    }));
    (0, mocha_1.it)('should be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ show: false }">
                <button x-on:click="show = ! show"></button>
                <template x-if="show">
                    <p></p>
                </template>
            </div>
        `;
        (0, create_1.GetOrCreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, if_1.IfDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(!document.querySelector('p')).equal(true);
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(!document.querySelector('p')).equal(false); });
    }));
    (0, mocha_1.it)('should contain reactive elements', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ show: false, foo: 'bar' }">
                <h1 x-on:click="show = ! show"></h1>
                <template x-if="show">
                    <h2 x-on:click="foo = 'baz'"></h2>
                </template>
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.GetOrCreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, if_1.IfDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(!document.querySelector('h2')).equal(true);
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        user_event_1.default.click(document.querySelector('h1'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(!document.querySelector('h2')).equal(false); });
        user_event_1.default.click(document.querySelector('h2'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz'); });
    }));
    (0, mocha_1.it)('should attach event listeners once', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ count: 0 }">
                <span x-text="count"></span>
                <template x-if="true">
                    <button x-on:click="count += 1">Click me</button>
                </template>
            </div>
        `;
        (0, create_1.GetOrCreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, if_1.IfDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('0');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('1'); });
    }));
    (0, mocha_1.it)('should be complemented by \'x-else\' directive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ show: false }">
                <template x-if="show">
                    <p x-text="'Shown'"></p>
                </template>
                <template x-else>
                    <p x-text="'Hidden'"></p>
                </template>
            </div>
        `;
        (0, create_1.GetOrCreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, if_1.IfDirectiveHandlerCompact)();
        (0, else_1.ElseDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('Hidden');
    }));
    (0, mocha_1.it)('should be complemented by \'x-else\' directive and be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ show: true }">
                <button x-on:click="show = ! show"></button>
                <template x-if="show">
                    <p x-text="'Shown'"></p>
                </template>
                <template x-else>
                    <p x-text="'Hidden'"></p>
                </template>
            </div>
        `;
        (0, create_1.GetOrCreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, if_1.IfDirectiveHandlerCompact)();
        (0, else_1.ElseDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('Shown');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('Hidden'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('Shown'); });
    }));
    (0, mocha_1.it)('should be complemented by a chain of \'x-else\' directives', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ count: 0 }">
                <button x-on:click="count += 1"></button>
                <template x-if="count == 0">
                    <p x-text="'Count 0'"></p>
                </template>
                <template x-else="count == 1">
                    <p x-text="'Count 1'"></p>
                </template>
                <template x-else>
                    <p x-text="'Count *'"></p>
                </template>
            </div>
        `;
        (0, create_1.GetOrCreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, if_1.IfDirectiveHandlerCompact)();
        (0, else_1.ElseDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1);
        (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('Count 0');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('Count 1'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('p').length).equal(1); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('p')[0].textContent).equal('Count *'); });
    }));
    (0, mocha_1.it)('should work inside a loop', () => {
        document.body.innerHTML = `
            <div x-data="{ foos: [{bar: 'baz'}, {bar: 'bop'}]}">
                <template x-each="foos as foo">
                    <template x-if="foo.bar === 'baz'">
                        <span x-text="foo.bar"></span>
                    </template>
                </template>
            </div>
        `;
        (0, create_1.GetOrCreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, if_1.IfDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span').length).equal(1);
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz');
    });
});
