import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor, fireEvent } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

let randomString = require("randomstring");

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { TextDirectiveHandlerCompact } from '../directive/core/flow/text';
import { ModelDirectiveHandlerCompact } from '../directive/core/flow/model';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';
import { GetGlobal } from '../global/get';

describe('x-model directive', () => {
    it('should have value binding when initialized', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <input x-model="foo">
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('bar');
    });

    it('should update value when updated via input event', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <input x-model="foo">
                <span x-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
        
        userEvent.clear(document.querySelector('input')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('') });
        
        userEvent.type(document.querySelector('input')!, 'baz');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should reflect data changed elsewhere', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <input x-model="foo">
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('bar');
        
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('input')!.value).equal('baz') });
    });

    it('should cast value to number if \'.number\' modifier is present', async () => {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ $config: { name: '${key}' }, foo: null }">
                <input type="number" x-model.number="foo">
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        userEvent.type(document.querySelector('input')!, '123');
        
        await waitFor(() => { expect(GetGlobal().FindComponentByName(key)!.GetRootProxy().GetNative()['foo']).equal(123) });
    });

    it('should return original value if casting fails; numeric value if casting passes', async () => {
        let key = randomString.generate(18);
        document.body.innerHTML = `
            <div x-data="{ $config: { name: '${key}' }, foo: 0, bar: '' }">
                <input type="number" x-model.number="foo">
                <input x-model.number="bar">
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        let proxy = GetGlobal().FindComponentByName(key)!.GetRootProxy().GetNative();
        
        userEvent.clear(document.querySelectorAll('input')[0]);
        
        await waitFor(() => { expect(proxy['foo']).equal('') });
    
        userEvent.type(document.querySelectorAll('input')[0], '-');
    
        await waitFor(() => { expect(proxy['foo']).equal('') });
        
        userEvent.type(document.querySelectorAll('input')[0], '123');
    
        await waitFor(() => { expect(proxy['foo']).equal(123) });
        
        userEvent.clear(document.querySelectorAll('input')[1]);
    
        await waitFor(() => { expect(proxy['bar']).equal('') });
        
        userEvent.type(document.querySelectorAll('input')[1], '-');
    
        await waitFor(() => { expect(proxy['bar']).equal('-') });
    
        userEvent.type(document.querySelectorAll('input')[1], '123');
    
        await waitFor(() => { expect(proxy['bar']).equal(-123) });
    });

    it('should trim value if \'.trim\' modifier is present', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: '' }">
                <input x-model.trim="foo">
                <span x-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        userEvent.type(document.querySelector('input')!, 'bar   ');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });
    });

    it('should update value when updated via changed event when \'.lazy\' modifier is present', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <input x-model.lazy="foo">
                <span x-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();

        fireEvent.input(document.querySelector('input')!, { target: { value: 'baz' } });
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });
    
        fireEvent.change(document.querySelector('input')!, { target: { value: 'baz' } });
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should bind checkbox value', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: true }">
                <input type="checkbox" x-model="foo">
                <span x-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.checked).equal(true);
        expect(document.querySelector('span')!.textContent).equal('true');

        userEvent.click(document.querySelector('input')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('false') });
    });

    it('should bind checkbox value to array', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: ['bar'] }">
                <input type="checkbox" x-model="foo" value="bar">
                <input type="checkbox" x-model="foo" value="baz">
                <span x-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('input')[0].checked).equal(true);
        expect(document.querySelectorAll('input')[1].checked).equal(false);
        expect(document.querySelector('span')!.textContent).equal('["bar"]');
    
        userEvent.click(document.querySelectorAll('input')[1]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('input')[0].checked).equal(true);
            expect(document.querySelectorAll('input')[1].checked).equal(true);
            expect(document.querySelector('span')!.textContent).equal('["bar","baz"]');
        });
    });

    it('should support the \'.number\' modifier when binding checkbox value to array', async () => {
        document.body.innerHTML = `
            <div x-data="{ selected: [2] }">
                <input type="checkbox" value="1" x-model.number="selected">
                <input type="checkbox" value="2" x-model.number="selected">
                <input type="checkbox" value="3" x-model.number="selected">
                <span x-text="selected"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('input')[0].checked).equal(false);
        expect(document.querySelectorAll('input')[1].checked).equal(true);
        expect(document.querySelectorAll('input')[2].checked).equal(false);
        expect(document.querySelector('span')!.textContent).equal("[2]");
    
        userEvent.click(document.querySelectorAll('input')[2]);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal("[2,3]") });
    
        userEvent.click(document.querySelectorAll('input')[0]);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal("[2,3,1]") });
    
        userEvent.click(document.querySelectorAll('input')[0]);
        userEvent.click(document.querySelectorAll('input')[1]);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal("[3]") });
    });

    it('should bind radio value', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <input type="radio" x-model="foo" value="bar">
                <input type="radio" x-model="foo" value="baz">
                <span x-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('input')[0].checked).equal(true);
        expect(document.querySelectorAll('input')[1].checked).equal(false);
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.querySelectorAll('input')[1]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('input')[0].checked).equal(false);
            expect(document.querySelectorAll('input')[1].checked).equal(true);
            expect(document.querySelector('span')!.textContent).equal('baz');
        });
    });

    it('should bind select dropdown', async () => {
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
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('option')[0].selected).equal(false);
        expect(document.querySelectorAll('option')[1].selected).equal(true);
        expect(document.querySelectorAll('option')[2].selected).equal(false);
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        fireEvent.change(document.querySelector('select')!, { target: { value: 'baz' } });
    
        await waitFor(() => {
            expect(document.querySelectorAll('option')[0].selected).equal(false);
            expect(document.querySelectorAll('option')[1].selected).equal(false);
            expect(document.querySelectorAll('option')[2].selected).equal(true);
            expect(document.querySelector('span')!.textContent).equal('baz');
        });
    });

    it('should bind multiple select dropdown', async () => {
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
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('option')[0].selected).equal(false);
        expect(document.querySelectorAll('option')[1].selected).equal(true);
        expect(document.querySelectorAll('option')[2].selected).equal(false);
        expect(document.querySelector('span')!.textContent).equal('["bar"]');

        userEvent.selectOptions(document.querySelector('select')!, ['bar', 'baz']);
    
        await waitFor(() => {
            expect(document.querySelectorAll('option')[0].selected).equal(false);
            expect(document.querySelectorAll('option')[1].selected).equal(true);
            expect(document.querySelectorAll('option')[2].selected).equal(true);
            expect(document.querySelector('span')!.textContent).equal('["bar","baz"]');
        });
    });

    it('should bind nested keys', async () => {
        document.body.innerHTML = `
            <div x-data="{ some: { nested: { key: 'foo' } } }">
                <input type="text" x-model="some.nested.key">
                <span x-text="some.nested.key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('foo');
        expect(document.querySelector('span')!.textContent).equal('foo');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: 'bar' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('bar');
            expect(document.querySelector('span')!.textContent).equal('bar');
        });
    });

    it('should convert undefined nested model key to empty string by default', async () => {
        document.body.innerHTML = `
            <div x-data="{ some: { nested: {} } }">
                <input type="text" x-model="some.nested.key">
                <span x-text="some.nested.key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('');
        expect(document.querySelector('span')!.textContent).equal('');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: 'bar' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('bar');
            expect(document.querySelector('span')!.textContent).equal('bar');
        });
    });

    it('should bind color input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: '#ff0000' }">
                <input type="color" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('#ff0000');
        expect(document.querySelector('span')!.textContent).equal('#ff0000');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: '#00ff00' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('#00ff00');
            expect(document.querySelector('span')!.textContent).equal('#00ff00');
        });
    });

    it('should bind date input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: '2020-07-10' }">
                <input type="date" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('2020-07-10');
        expect(document.querySelector('span')!.textContent).equal('2020-07-10');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: '2021-01-01' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('2021-01-01');
            expect(document.querySelector('span')!.textContent).equal('2021-01-01');
        });
    });

    it('should bind datetime-local input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: '2020-01-01T20:00' }">
                <input type="datetime-local" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('2020-01-01T20:00');
        expect(document.querySelector('span')!.textContent).equal('2020-01-01T20:00');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: '2021-02-02T20:00' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('2021-02-02T20:00');
            expect(document.querySelector('span')!.textContent).equal('2021-02-02T20:00');
        });
    });

    it('should bind email input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: 'anon.legion@scope.ns' }">
                <input type="email" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('anon.legion@scope.ns');
        expect(document.querySelector('span')!.textContent).equal('anon.legion@scope.ns');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: 'user.last@some.sp' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('user.last@some.sp');
            expect(document.querySelector('span')!.textContent).equal('user.last@some.sp');
        });
    });

    it('should bind month input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: '2020-04' }">
                <input type="month" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('2020-04');
        expect(document.querySelector('span')!.textContent).equal('2020-04');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: '2021-05' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('2021-05');
            expect(document.querySelector('span')!.textContent).equal('2021-05');
        });
    });

    it('should bind number input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: '11' }">
                <input type="number" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('11');
        expect(document.querySelector('span')!.textContent).equal('11');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: '2021' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('2021');
            expect(document.querySelector('span')!.textContent).equal('2021');
        });
    });

    it('should bind password input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: 'SecretKey' }">
                <input type="password" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('SecretKey');
        expect(document.querySelector('span')!.textContent).equal('SecretKey');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: 'NewSecretKey' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('NewSecretKey');
            expect(document.querySelector('span')!.textContent).equal('NewSecretKey');
        });
    });

    it('should bind range input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: '10' }">
                <input type="range" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('10');
        expect(document.querySelector('span')!.textContent).equal('10');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: '20' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('20');
            expect(document.querySelector('span')!.textContent).equal('20');
        });
    });

    it('should bind search input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: '' }">
                <input type="search" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('');
        expect(document.querySelector('span')!.textContent).equal('');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: 'term' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('term');
            expect(document.querySelector('span')!.textContent).equal('term');
        });
    });

    it('should bind tel input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: '+12345678901' }">
                <input type="tel " x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('+12345678901');
        expect(document.querySelector('span')!.textContent).equal('+12345678901');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: '+1239874560' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('+1239874560');
            expect(document.querySelector('span')!.textContent).equal('+1239874560');
        });
    });

    it('should bind time input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: '22:00' }">
                <input type="time" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('22:00');
        expect(document.querySelector('span')!.textContent).equal('22:00');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: '23:00' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('23:00');
            expect(document.querySelector('span')!.textContent).equal('23:00');
        });
    });

    it('should bind week input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: '2020-W20' }">
                <input type="week" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('2020-W20');
        expect(document.querySelector('span')!.textContent).equal('2020-W20');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: '2020-W30' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('2020-W30');
            expect(document.querySelector('span')!.textContent).equal('2020-W30');
        });
    });

    it('should bind url input', async () => {
        document.body.innerHTML = `
            <div x-data="{ key: 'https://example.com' }">
                <input type="url" x-model="key">
                <span x-text="key"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ModelDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('input')!.value).equal('https://example.com');
        expect(document.querySelector('span')!.textContent).equal('https://example.com');
    
        fireEvent.input(document.querySelector('input')!, { target: { value: 'https://whatismyip.com' } });
    
        await waitFor(() => {
            expect(document.querySelector('input')!.value).equal('https://whatismyip.com');
            expect(document.querySelector('span')!.textContent).equal('https://whatismyip.com');
        });
    });
});
