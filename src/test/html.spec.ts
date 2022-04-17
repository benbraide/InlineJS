import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';
import { HtmlDirectiveHandlerCompact } from '../directive/core/flow/html';

describe('x-html directive', () => {
    it('should set text content on init', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-html="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        HtmlDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.innerHTML).equal('bar') });
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <button x-on:click="foo = 'baz'"></button>
                <span x-html="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        HtmlDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.innerHTML).equal('bar') });
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.innerHTML).equal('baz') });
    });

    it('should work with async expressions', async () => {
        globalThis.asyncCall = () => {
            return new Promise<string>((resolve) => setTimeout(() => resolve('foo')));
        };
        
        document.body.innerHTML = `
            <div x-data>
                <span x-html="globalThis.asyncCall()"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        HtmlDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.innerHTML).equal('foo') });
    });
});
