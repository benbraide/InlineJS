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
const format_1 = require("../magic/extended/format");
(0, mocha_1.describe)('x-text directive', () => {
    (0, mocha_1.it)('should set text content on init', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar', zoo: 'zar' }">
                <span x-text="foo"></span>
                <span x-text="zoo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('zar'); });
    }));
    (0, mocha_1.it)('should be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <button x-on:click="foo = 'baz'"></button>
                <span x-text="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('baz'); });
    }));
    (0, mocha_1.it)('should work with async expressions', () => __awaiter(void 0, void 0, void 0, function* () {
        globalThis.asyncCall = () => {
            return new Promise((resolve) => setTimeout(() => resolve('foo')));
        };
        document.body.innerHTML = `
            <div x-data>
                <span x-text="globalThis.asyncCall()"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('foo'); });
    }));
    (0, mocha_1.it)('should work with the \'$format\' global magic attribute', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <span x-text="$format.prefix(foo, 'prefixed_')"></span>
                <span x-text="$format.suffix(foo, '_suffixed')"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, format_1.FormatMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('prefixed_bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('bar_suffixed'); });
    }));
    (0, mocha_1.it)('should work with the \'$format\' global magic attribute and be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <span x-text="$format.prefix(foo, 'prefixed_')"></span>
                <span x-text="$format.suffix(foo, '_suffixed')"></span>
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, format_1.FormatMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('prefixed_bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('bar_suffixed'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('baz'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('prefixed_baz'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('baz_suffixed'); });
    }));
    (0, mocha_1.it)('should work with the \'$format\' global magic attribute and asyn expressions', () => __awaiter(void 0, void 0, void 0, function* () {
        globalThis.asyncCall = () => {
            return new Promise((resolve) => setTimeout(() => resolve('foo')));
        };
        document.body.innerHTML = `
            <div x-data>
                <span x-text="globalThis.asyncCall()"></span>
                <span x-text="$format.prefix(globalThis.asyncCall(), 'prefixed_')"></span>
                <span x-text="$format.suffix(globalThis.asyncCall(), '_suffixed')"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, format_1.FormatMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[0].textContent).equal('foo'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[1].textContent).equal('prefixed_foo'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelectorAll('span')[2].textContent).equal('foo_suffixed'); });
    }));
});
