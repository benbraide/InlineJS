import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { TextDirectiveHandlerCompact } from '../directive/core/flow/text';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';

describe('x-text directive', () => {
    it('should set text content on init', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar', zoo: 'zar' }">
                <span x-text="foo"></span>
                <span x-text="zoo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('bar') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('zar') });
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <button x-on:click="foo = 'baz'"></button>
                <span x-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should work with async expressions', async () => {
        globalThis.asyncCall = () => {
            return new Promise<string>((resolve) => setTimeout(() => resolve('foo')));
        };
        
        document.body.innerHTML = `
            <div x-data>
                <span x-text="globalThis.asyncCall()"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('foo') });
    });
});
