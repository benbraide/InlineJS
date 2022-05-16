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
const ref_1 = require("../directive/core/data/ref");
const refs_1 = require("../magic/core/data/refs");
const nexttick_1 = require("../magic/core/nexttick");
const each_1 = require("../directive/core/control/each");
(0, mocha_1.describe)('$nextTick global magic property', () => {
    (0, mocha_1.it)('should execute attached callback', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-ref="span" x-text="foo"></span>
                <button x-on:click="foo = 'baz'; $nextTick(() => { $refs.span.textContent = 'bob' })"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, ref_1.RefDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, refs_1.RefsMagicHandlerCompact)();
        (0, nexttick_1.NextTickMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => (0, chai_1.expect)(document.querySelector('span').textContent).equal('bob'));
    }));
    (0, mocha_1.it)('should wait for x-each directive to finish rendering', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ list: ['one', 'two'], check: 2 }">
                <template x-each="list">
                    <span x-text="$each.value"></span>
                </template>
                <p x-text="check"></p>
                <button x-on:click="list = ['one', 'two', 'three']; $nextTick(() => { check = document.querySelectorAll('span').length })"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, each_1.EachDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, nexttick_1.NextTickMagicHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('p').textContent).equal('2');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('p').textContent).equal('3'); });
    }));
});
