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
const uninit_1 = require("../directive/core/lifecycle/uninit");
const post_1 = require("../directive/core/lifecycle/post");
const on_1 = require("../directive/core/flow/on");
const static_1 = require("../directive/core/reactive/static");
(0, mocha_1.describe)('lifecycle', () => {
    (0, mocha_1.it)('should execute \'x-uninit\' on element removal', () => __awaiter(void 0, void 0, void 0, function* () {
        const runObservers = new Array();
        global.MutationObserver = class {
            constructor(callback) {
                runObservers.push(callback);
            }
            observe() { }
        };
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <span x-uninit="foo = 'baz'"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, uninit_1.UninitDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        let span = document.querySelectorAll('span')[1];
        span.remove();
        runObservers.forEach(cb => cb([
            {
                target: document.body.firstElementChild,
                type: 'childList',
                addedNodes: [],
                removedNodes: [span],
            },
        ]));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
    }));
    (0, mocha_1.it)('should execute \'x-post\' after all other directives and offspring directives are evaluated', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }" x-post="foo = 'post'">
                <span x-text="foo" x-static="foo = 'bar'"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, post_1.PostDirectiveHandlerCompact)();
        (0, static_1.StaticDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('post'); });
    }));
    (0, mocha_1.it)('should execute \'x-post\' after offspring x-post directives are evaluated', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }" x-post="foo = 'post'">
                <span x-text="foo" x-post="foo = 'bar'"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, post_1.PostDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('post'); });
    }));
    (0, mocha_1.it)('should bind elements added to the DOM after initial attachment', () => __awaiter(void 0, void 0, void 0, function* () {
        const runObservers = new Array();
        global.MutationObserver = class {
            constructor(callback) {
                runObservers.push(callback);
            }
            observe() { }
        };
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, static_1.StaticDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar');
        let tmpl = document.createElement('template');
        tmpl.innerHTML = `
            <span x-static="foo = 'baz'"></span>
            <button x-on:click="foo = 'clicked'"></button>
        `;
        let newEls = Array.from(tmpl.content.children).map(child => child.cloneNode(true));
        newEls.forEach(el => document.body.firstElementChild.appendChild(el));
        runObservers.forEach(cb => cb([
            {
                target: document.body.firstElementChild,
                type: 'childList',
                addedNodes: newEls,
                removedNodes: [],
            }
        ]));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('clicked'); });
    }));
});
