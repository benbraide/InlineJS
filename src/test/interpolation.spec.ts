import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'

import { CreateGlobal } from '../global/create';
import { Interpolate } from '../global/interpolator';

describe('interpolation', () => {
    it('should replace texts', () => {
        let component = CreateGlobal().CreateComponent(document.createElement('template'));

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        let replaced = '';
        Interpolate({
            text: 'I am {{ name }} and {{ age }} years old.',
            componentId: component.GetId(),
            contextElement: component.GetRoot(),
            handler: value => (replaced = value),
        });

        expect(replaced).equal('I am John Doe and 72 years old.');
    });

    it('should replace texts and be reactive', async () => {
        let component = CreateGlobal().CreateComponent(document.createElement('template'));

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        let replaced = '';
        Interpolate({
            text: 'I am {{ name }} and {{ age }} years old.',
            componentId: component.GetId(),
            contextElement: component.GetRoot(),
            handler: value => (replaced = value),
        });

        expect(replaced).equal('I am John Doe and 72 years old.');

        component.GetRootProxy().GetNative()['name'] = 'Jane Doe';
        component.GetRootProxy().GetNative()['age'] = 18;

        await waitFor(() => { expect(replaced).equal('I am Jane Doe and 18 years old.') });
    });

    it('should replace elements\' text contents', () => {
        let component = CreateGlobal().CreateComponent(document.createElement('template')), el = document.createElement('p');

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and {{ age }} years old.';

        Interpolate({
            componentId: component.GetId(),
            contextElement: el,
        });

        expect(el.textContent).equal('I am John Doe and 72 years old.');
    });

    it('should replace elements\' text contents and be reactive', async () => {
        let component = CreateGlobal().CreateComponent(document.createElement('template')), el = document.createElement('p');

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and {{ age }} years old.';

        Interpolate({
            componentId: component.GetId(),
            contextElement: el,
        });

        expect(el.textContent).equal('I am John Doe and 72 years old.');

        component.GetRootProxy().GetNative()['name'] = 'Jane Doe';
        component.GetRootProxy().GetNative()['age'] = 18;

        await waitFor(() => { expect(el.textContent).equal('I am Jane Doe and 18 years old.') });
    });

    it('should support nesting', () => {
        let component = CreateGlobal().CreateComponent(document.createElement('template')), el = document.createElement('p');

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and <span>{{ age }} years</span> old.';

        let span = el.querySelector('span')!;
        
        Interpolate({
            componentId: component.GetId(),
            contextElement: el,
        });
        
        expect(el.textContent).equal('I am John Doe and {{ age }} years old.');
        expect(el.querySelector('span')).equal(span);
        expect(span.textContent).equal('{{ age }} years');

        Interpolate({
            componentId: component.GetId(),
            contextElement: span,
        });
        
        expect(el.textContent).equal('I am John Doe and 72 years old.');
        expect(span.textContent).equal('72 years');
    });

    it('should support nesting and be reactive', async () => {
        let component = CreateGlobal().CreateComponent(document.createElement('template')), el = document.createElement('p');

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and <span>{{ age }} years</span> old.';

        let span = el.querySelector('span')!;

        Interpolate({
            componentId: component.GetId(),
            contextElement: el,
        });
        
        expect(el.textContent).equal('I am John Doe and {{ age }} years old.');
        expect(el.querySelector('span')).equal(span);
        expect(span.textContent).equal('{{ age }} years');

        Interpolate({
            componentId: component.GetId(),
            contextElement: span,
        });
        
        expect(el.textContent).equal('I am John Doe and 72 years old.');
        expect(span.textContent).equal('72 years');

        component.GetRootProxy().GetNative()['name'] = 'Jane Doe';

        await waitFor(() => {
            expect(el.textContent).equal('I am Jane Doe and 72 years old.');
            expect(el.querySelector('span')).equal(span);
            expect(span.textContent).equal('72 years');
        });

        component.GetRootProxy().GetNative()['age'] = 18;

        await waitFor(() => {
            expect(el.textContent).equal('I am Jane Doe and 18 years old.');
            expect(span.textContent).equal('18 years');
        });
    });
});
