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
const style_1 = require("../directive/core/attr/style");
const on_1 = require("../directive/core/flow/on");
(0, mocha_1.describe)('x-style directive', () => {
    (0, mocha_1.it)('should set corresponding value on initialization', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'block' }">
                <span x-style:display="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, style_1.StyleDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').style.display).equal('block');
    });
    (0, mocha_1.it)('should be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ foo: 'block' }">
                <span x-style:display="foo"></span>
                <button x-on:click="foo = 'flex'"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)(undefined, 999);
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, style_1.StyleDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').style.display).equal('block');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').style.display).equal('flex'); });
    }));
    (0, mocha_1.it)('should accept a key-value map', () => {
        document.body.innerHTML = `
            <div x-data="{ map: { display: 'block', width: '180px' } }">
                <span x-style="map"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, style_1.StyleDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').style.display).equal('block');
        (0, chai_1.expect)(document.querySelector('span').style.width).equal('180px');
    });
    (0, mocha_1.it)('should have reactive key-value map', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div x-data="{ map: { display: 'block', width: '180px' } }">
                <span x-style="map"></span>
                <button x-on:click="map.width = '270px'"></button>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, style_1.StyleDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').style.display).equal('block');
        (0, chai_1.expect)(document.querySelector('span').style.width).equal('180px');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').style.display).equal('block'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').style.width).equal('270px'); });
    }));
    (0, mocha_1.it)('should format keys to camel casing', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: '99' }">
                <span x-style:z-index="foo"></span>
            </div>
        `;
        (0, create_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, style_1.StyleDirectiveHandlerCompact)();
        (0, attach_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').style.zIndex).equal('99');
    });
});
