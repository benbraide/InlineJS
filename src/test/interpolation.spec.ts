import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'

import { CreateGlobal } from '../global/create';
import { Interpolate, InterpolateText } from '../global/interpolator';
import { GetGlobal } from '../global/get';

describe('interpolation', () => {
    it('should replace texts', () => {
        const component = CreateGlobal().CreateComponent(document.createElement('template'));

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        let replaced = '';
        InterpolateText({
            text: 'I am {{ name }} and {{ age }} years old.',
            componentId: component.GetId(),
            contextElement: component.GetRoot(),
            handler: value => (replaced = value),
        });

        expect(replaced).equal('I am John Doe and 72 years old.');
    });

    it('should replace texts and be reactive', async () => {
        const component = CreateGlobal().CreateComponent(document.createElement('template'));

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        let replaced = '';
        InterpolateText({
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

    it('should store objects', () => {
        const component = CreateGlobal().CreateComponent(document.createElement('template'));

        const info = {
            name: 'John Doe',
            age: 72,
        };
        
        component.GetRootProxy().GetNative()['name'] = info.name;
        component.GetRootProxy().GetNative()['age'] = info.age;

        let replaced = '';
        InterpolateText({
            text: '{{ ({ name, age }) }}',
            componentId: component.GetId(),
            contextElement: component.GetRoot(),
            handler: value => (replaced = value),
            storeObject: true,
        });

        const key = GetGlobal().GetLastObjectKey();
        const value = GetGlobal().RetrieveObject({
            key,
            componentId: component.GetId(),
            contextElement: component.GetRoot(),
        });

        expect(replaced).equal(key);
        expect(JSON.stringify(value)).equal(JSON.stringify(info));
    });

    it('should replace elements\' text contents', async () => {
        const component = CreateGlobal().CreateComponent(document.createElement('template')), el = document.createElement('p');

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and {{ age }} years old.';

        Interpolate({
            componentId: component.GetId(),
            contextElement: el,
        });

        await waitFor(() => { expect(el.textContent).equal('I am John Doe and 72 years old.') });
    });

    it('should replace elements\' text contents and be reactive', async () => {
        const component = CreateGlobal().CreateComponent(document.createElement('template')), el = document.createElement('p');

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and {{ age }} years old.';

        Interpolate({
            componentId: component.GetId(),
            contextElement: el,
        });

        await waitFor(() => { expect(el.textContent).equal('I am John Doe and 72 years old.') });

        component.GetRootProxy().GetNative()['name'] = 'Jane Doe';
        component.GetRootProxy().GetNative()['age'] = 18;

        await waitFor(() => { expect(el.textContent).equal('I am Jane Doe and 18 years old.') });
    });

    it('should not replace text in child elements', async () => {
        const component = CreateGlobal().CreateComponent(document.createElement('template')), el = document.createElement('p');

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and <span>{{ age }} years</span> old.';

        const span = el.querySelector('span')!;

        Interpolate({
            componentId: component.GetId(),
            contextElement: el,
        });

        await waitFor(() => {
            // 'name' is in a direct text node of 'el', so it gets replaced.
            // 'age' is inside a child 'span', so it is NOT replaced.
            expect(el.textContent).equal('I am John Doe and {{ age }} years old.');
            expect(el.querySelector('span')).equal(span);
            expect(span.textContent).equal('{{ age }} years');
        });
    });

    it('should not replace text in child elements but should be reactive on parent', async () => {
        const component = CreateGlobal().CreateComponent(document.createElement('template')), el = document.createElement('p');

        component.GetRootProxy().GetNative()['name'] = 'John Doe';
        component.GetRootProxy().GetNative()['age'] = 72;

        component.GetRoot().append(el);
        el.innerHTML = 'I am {{ name }} and <span>{{ age }} years</span> old.';

        Interpolate({
            componentId: component.GetId(),
            contextElement: el,
        });
        
        await waitFor(() => { expect(el.textContent).equal('I am John Doe and {{ age }} years old.'); });

        // Update 'name' - this should be reactive because it's in a direct text node.
        component.GetRootProxy().GetNative()['name'] = 'Jane Doe';

        await waitFor(() => { expect(el.textContent).equal('I am Jane Doe and {{ age }} years old.'); });

        // Update 'age' - this should NOT be reactive because it's in a child element.
        component.GetRootProxy().GetNative()['age'] = 18;

        // Wait a tick to ensure no reactive update happens, then check.
        // The text content should remain unchanged because 'age' was never bound.
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(el.textContent).equal('I am Jane Doe and {{ age }} years old.');
        expect(el.querySelector('span')?.textContent).equal('{{ age }} years');
    });
});
