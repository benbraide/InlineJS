import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { GetOrCreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { IfDirectiveHandlerCompact } from '../directive/core/control/if';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';
import { TextDirectiveHandlerCompact } from '../directive/core/flow/text';
import { EachDirectiveHandlerCompact } from '../directive/core/control/each';

describe('x-if directive', () => {
    it('should create element on truthy value', async () => {
        document.body.innerHTML = `
            <div x-data="{ show: true }">
                <template x-if="show">
                    <p></p>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
    });

    it('should not create element on falsy value', async () => {
        document.body.innerHTML = `
            <div x-data="{ show: false }">
                <template x-if="show">
                    <p></p>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(0);
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ show: false }">
                <button x-on:click="show = ! show"></button>
                <template x-if="show">
                    <p></p>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(!document.querySelector('p')).equal(true);
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(!document.querySelector('p')).equal(false) });
    });

    it('should contain reactive elements', async () => {
        document.body.innerHTML = `
            <div x-data="{ show: false, foo: 'bar' }">
                <h1 x-on:click="show = ! show"></h1>
                <template x-if="show">
                    <h2 x-on:click="foo = 'baz'"></h2>
                </template>
                <span x-text="foo"></span>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(!document.querySelector('h2')).equal(true);
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.querySelector('h1')!);
    
        await waitFor(() => { expect(!document.querySelector('h2')).equal(false) });
    
        userEvent.click(document.querySelector('h2')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should attach event listeners once', async () => {
        document.body.innerHTML = `
            <div x-data="{ count: 0 }">
                <span x-text="count"></span>
                <template x-if="true">
                    <button x-on:click="count += 1">Click me</button>
                </template>
            </div>
        `;
        
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('0');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('1') });
    });

    it('should work inside a loop', () => {
        document.body.innerHTML = `
            <div x-data="{ foos: [{bar: 'baz'}, {bar: 'bop'}]}">
                <template x-each="foos as foo">
                    <template x-if="foo.bar === 'baz'">
                        <span x-text="foo.bar"></span>
                    </template>
                </template>
            </div>
        `;
    
        GetOrCreateGlobal();

        DataDirectiveHandlerCompact();
        IfDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span').length).equal(1);
        expect(document.querySelector('span')!.textContent).equal('baz');
    });
});
