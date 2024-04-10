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
const create_1 = require("../global/create");
const interpolator_1 = require("../global/interpolator");
const get_1 = require("../global/get");
(0, mocha_1.describe)('interpolation', () => {
    (0, mocha_1.it)('should replace texts', () => {
        const component = (0, create_1.CreateGlobal)().CreateComponent(document.createElement('template'));
        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;
        let replaced = '';
        (0, interpolator_1.InterpolateText)({
            text: 'I am {{ name }} and {{ age }} years old.',
            componentId: component.GetId(),
            contextElement: component.GetRoot(),
            handler: value => (replaced = value),
        });
        (0, chai_1.expect)(replaced).equal('I am John Doe and 72 years old.');
    });
    (0, mocha_1.it)('should replace texts and be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        const component = (0, create_1.CreateGlobal)().CreateComponent(document.createElement('template'));
        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;
        let replaced = '';
        (0, interpolator_1.InterpolateText)({
            text: 'I am {{ name }} and {{ age }} years old.',
            componentId: component.GetId(),
            contextElement: component.GetRoot(),
            handler: value => (replaced = value),
        });
        (0, chai_1.expect)(replaced).equal('I am John Doe and 72 years old.');
        component.GetRootProxy().GetNative()['name'] = 'Jane Doe';
        component.GetRootProxy().GetNative()['age'] = 18;
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(replaced).equal('I am Jane Doe and 18 years old.'); });
    }));
    (0, mocha_1.it)('should store objects', () => {
        const component = (0, create_1.CreateGlobal)().CreateComponent(document.createElement('template'));
        const info = {
            name: 'John Doe',
            age: 72,
        };
        component.GetRootProxy().GetNative()['name'] = info.name;
        component.GetRootProxy().GetNative()['age'] = info.age;
        let replaced = '';
        (0, interpolator_1.InterpolateText)({
            text: '{{ ({ name, age }) }}',
            componentId: component.GetId(),
            contextElement: component.GetRoot(),
            handler: value => (replaced = value),
            storeObject: true,
        });
        const key = (0, get_1.GetGlobal)().GetLastObjectKey();
        const value = (0, get_1.GetGlobal)().RetrieveObject({
            key,
            componentId: component.GetId(),
            contextElement: component.GetRoot(),
        });
        (0, chai_1.expect)(replaced).equal(key);
        (0, chai_1.expect)(JSON.stringify(value)).equal(JSON.stringify(info));
    });
    (0, mocha_1.it)('should replace elements\' text contents', () => __awaiter(void 0, void 0, void 0, function* () {
        const component = (0, create_1.CreateGlobal)().CreateComponent(document.createElement('template')), el = document.createElement('p');
        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;
        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and {{ age }} years old.';
        (0, interpolator_1.Interpolate)({
            componentId: component.GetId(),
            contextElement: el,
        });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(el.textContent).equal('I am John Doe and 72 years old.'); });
    }));
    (0, mocha_1.it)('should replace elements\' text contents and be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        const component = (0, create_1.CreateGlobal)().CreateComponent(document.createElement('template')), el = document.createElement('p');
        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;
        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and {{ age }} years old.';
        (0, interpolator_1.Interpolate)({
            componentId: component.GetId(),
            contextElement: el,
        });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(el.textContent).equal('I am John Doe and 72 years old.'); });
        component.GetRootProxy().GetNative()['name'] = 'Jane Doe';
        component.GetRootProxy().GetNative()['age'] = 18;
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(el.textContent).equal('I am Jane Doe and 18 years old.'); });
    }));
    (0, mocha_1.it)('should support nesting', () => __awaiter(void 0, void 0, void 0, function* () {
        const component = (0, create_1.CreateGlobal)().CreateComponent(document.createElement('template')), el = document.createElement('p');
        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;
        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and <span>{{ age }} years</span> old.';
        const span = el.querySelector('span');
        (0, interpolator_1.Interpolate)({
            componentId: component.GetId(),
            contextElement: el,
        });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(el.textContent).equal('I am John Doe and {{ age }} years old.');
            (0, chai_1.expect)(el.querySelector('span')).equal(span);
            (0, chai_1.expect)(span.textContent).equal('{{ age }} years');
        });
        (0, interpolator_1.Interpolate)({
            componentId: component.GetId(),
            contextElement: span,
        });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(el.textContent).equal('I am John Doe and 72 years old.');
            (0, chai_1.expect)(span.textContent).equal('72 years');
        });
    }));
    (0, mocha_1.it)('should support nesting and be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        const component = (0, create_1.CreateGlobal)().CreateComponent(document.createElement('template')), el = document.createElement('p');
        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;
        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and <span>{{ age }} years</span> old.';
        const span = el.querySelector('span');
        (0, interpolator_1.Interpolate)({
            componentId: component.GetId(),
            contextElement: el,
        });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(el.textContent).equal('I am John Doe and {{ age }} years old.');
            (0, chai_1.expect)(el.querySelector('span')).equal(span);
            (0, chai_1.expect)(span.textContent).equal('{{ age }} years');
        });
        (0, interpolator_1.Interpolate)({
            componentId: component.GetId(),
            contextElement: span,
        });
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(el.textContent).equal('I am John Doe and 72 years old.');
            (0, chai_1.expect)(span.textContent).equal('72 years');
        });
        component.GetRootProxy().GetNative()['name'] = 'Jane Doe';
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(el.textContent).equal('I am Jane Doe and 72 years old.');
            (0, chai_1.expect)(el.querySelector('span')).equal(span);
            (0, chai_1.expect)(span.textContent).equal('72 years');
        });
        component.GetRootProxy().GetNative()['age'] = 18;
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(el.textContent).equal('I am Jane Doe and 18 years old.');
            (0, chai_1.expect)(span.textContent).equal('18 years');
        });
    }));
});
